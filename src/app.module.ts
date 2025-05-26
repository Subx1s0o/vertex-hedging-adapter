import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbookModule } from './orderbook/orderbook.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [OrderbookModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
