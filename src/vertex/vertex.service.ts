import { Injectable, OnModuleInit } from '@nestjs/common';
import { createVertexClient } from '@vertex-protocol/client';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';

@Injectable()
export class VertexService implements OnModuleInit {
  client;

  onModuleInit() {
    const walletClient = createWalletClient({
      account: privateKeyToAccount(''),
      chain: arbitrumSepolia,
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: arbitrumSepolia,
      transport: http(),
    });

    this.client = createVertexClient('arbitrumTestnet', {
      walletClient,
      publicClient,
    });
  }
}
