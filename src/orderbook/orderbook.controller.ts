import { Controller, Get, Query } from '@nestjs/common';
import { OrderbookService } from './orderbook.service';

@Controller('v1/orderbook')
export class OrderbookController {
  constructor(private readonly orderbookService: OrderbookService) {}

  @Get()
  getOrderbook(@Query('instrumentId') instrumentId: string) {
    return this.orderbookService.getOrderbook(instrumentId);
  }
}
