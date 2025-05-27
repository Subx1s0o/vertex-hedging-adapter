import { Injectable, OnModuleInit } from '@nestjs/common';
import { OrderbookDto } from './dto/orderbook.dto';
import { InstrumentMapping } from 'src/utils';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { HttpService } from 'src/http/http.service';
import { config } from 'src/config';
import { Cron } from '@nestjs/schedule';
import * as crc32 from 'crc-32';

@Injectable()
export class OrderbookService implements OnModuleInit {
  private orderbooks = new Map<string, OrderbookDto>();
  private instrumentMappings = new Map<string, InstrumentMapping>();
  private vertexToOriginalMap = new Map<string, string>();

  constructor(
    private readonly instrumentsService: InstrumentsService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    const allInstruments = await this.instrumentsService.getInstruments();

    this.instrumentMappings.clear();
    this.vertexToOriginalMap.clear();

    const configuredInstruments = config.instruments;

    for (const configInstrument of configuredInstruments) {
      const matchedInstrument = allInstruments.find(
        (inst) => inst.instrument_name === configInstrument,
      );

      if (matchedInstrument && matchedInstrument.vertex_instrument) {
        const mapping = {
          original: configInstrument,
          vertex: matchedInstrument.vertex_instrument,
        };

        this.instrumentMappings.set(configInstrument, mapping);
        this.vertexToOriginalMap.set(
          matchedInstrument.vertex_instrument,
          configInstrument,
        );
      } else {
        console.warn(
          `Could not find mapping for configured instrument: ${configInstrument}`,
        );
      }
    }
  }

  getOrderbook(instrumentId: string) {
    const instrument = this.instrumentMappings.get(instrumentId);

    if (!instrument) {
      throw new Error(`Instrument ${instrumentId} not found`);
    }

    return this.orderbooks.get(instrument.vertex);
  }

  @Cron('* * * * * *')
  async updateOrderbooks() {
    for (const [originalInstrument, mapping] of this.instrumentMappings) {
      const orderbook = await this.httpService.get(`/orderbook`, {
        ticker_id: mapping.vertex,
        depth: config.orderbook_depth,
      });

      console.log(
        `Fetching orderbook for ${originalInstrument} (${mapping.vertex})`,
      );

      const orderbookDto = new OrderbookDto();
      const data = orderbook.data as any;
      orderbookDto.instrument = mapping.original;
      orderbookDto.ts = data?.timestamp?.toString() || '';
      orderbookDto.bids = (data?.bids || []).map(
        ([price, qty]: [number, number]) => ({
          price,
          qty,
        }),
      );
      orderbookDto.asks = (data?.asks || []).map(
        ([price, qty]: [number, number]) => ({
          price,
          qty,
        }),
      );
      orderbookDto.checksum = this.computeChecksum(
        orderbookDto.bids,
        orderbookDto.asks,
      );

      this.orderbooks.set(mapping.vertex, orderbookDto);
    }
  }

  private computeChecksum(bids: any[], asks: any[]): number {
    const depth = 10;

    const formatValue = (value: string | number): string => {
      return String(value).replace('.', '').replace(/^0+/, '');
    };

    const formatLevels = (levels: any[]): string[] =>
      levels.slice(0, depth).map((level) => {
        const price = formatValue(level.price);
        const qty = formatValue(level.qty);
        return price + qty;
      });

    const askParts = formatLevels(asks);
    const bidParts = formatLevels(bids);

    const combined = askParts.concat(bidParts).join('');
    return crc32.str(combined) >>> 0;
  }
}
