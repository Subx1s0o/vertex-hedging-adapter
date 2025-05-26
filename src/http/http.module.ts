import { Global, Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

@Global()
@Module({
  imports: [NestHttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
