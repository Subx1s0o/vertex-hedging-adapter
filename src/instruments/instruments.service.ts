import { Injectable } from '@nestjs/common';
import { HttpService } from 'src/http/http.service';
import { Instrument } from 'src/instruments/entities/instrument';
import { formatFromVertexInstrument } from 'src/utils';

@Injectable()
export class InstrumentsService {
  constructor(private readonly httpService: HttpService) {}

  async getInstruments() {
    const response = await this.httpService.get('/pairs', { market: 'perp' });

    const instruments: Instrument[] = [];

    (response.data as any[]).forEach((instrument: any) => {
      const formattedInstrument = formatFromVertexInstrument(
        instrument.ticker_id,
      );

      const newInstrument = new Instrument();

      newInstrument.base_currency = formattedInstrument.split('USDC')[0];
      newInstrument.quote_currency = instrument.quote;
      newInstrument.instrument_id = formattedInstrument;
      newInstrument.instrument_name = formattedInstrument;
      newInstrument.vertex_instrument = instrument.ticker_id;

      instruments.push(newInstrument);
    });

    return instruments;
  }
}
