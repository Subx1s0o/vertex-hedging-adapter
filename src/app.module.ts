import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbookModule } from './orderbook/orderbook.module';
import { VertexModule } from './vertex/vertex.module';

@Module({
  imports: [OrderbookModule, VertexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
