import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbookModule } from './orderbook/orderbook.module';
import { HttpModule } from './http/http.module';
import { InstrumentsModule } from './instruments/instruments.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    OrderbookModule,
    HttpModule,
    InstrumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
