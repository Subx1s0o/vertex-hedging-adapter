import { Module } from '@nestjs/common';
import { OrderbookService } from './orderbook.service';
import { OrderbookController } from './orderbook.controller';
import { InstrumentsModule } from 'src/instruments/instruments.module';
import { HttpModule } from 'src/http/http.module';

@Module({
  imports: [InstrumentsModule, HttpModule],
  controllers: [OrderbookController],
  providers: [OrderbookService],
})
export class OrderbookModule {}
