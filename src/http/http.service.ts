import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { config } from 'src/config';
import axios from 'axios';

@Injectable()
export class HttpService implements OnModuleInit {
  network_url = config.network_url;
  axiosInstance: typeof axios;

  constructor(private readonly httpService: NestHttpService) {}

  onModuleInit() {
    if (!this.httpService?.axiosRef) {
      throw new Error('HTTP service not properly initialized');
    }
    this.axiosInstance = this.httpService.axiosRef.create({
      baseURL: this.network_url,
    });
  }

  async get(endpoint: string, params?: Record<string, any>) {
    const queryString = params ? this.parseParamsToString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return await this.axiosInstance.get(url);
  }

  private parseParamsToString(params: Record<string, any>): string {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join('&');
  }
}
