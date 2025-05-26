import { Controller, Get, Param } from '@nestjs/common';
import { OrderbookService } from './orderbook.service';

@Controller('orderbook')
export class OrderbookController {
  constructor(private readonly orderbookService: OrderbookService) {}

  @Get(':instrumentId')
  async getOrderbook(@Param('instrumentId') instrumentId: string) {
    return this.orderbookService.getOrderbook(instrumentId);
  }
}
