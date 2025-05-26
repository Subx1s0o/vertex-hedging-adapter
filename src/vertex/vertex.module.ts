import { Module } from '@nestjs/common';
import { VertexService } from './vertex.service';

@Module({
  controllers: [],
  providers: [VertexService],
})
export class VertexModule {}
