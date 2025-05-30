import 'dotenv/config';

export const config = {
  privateKey: process.env.PRIVATE_KEY ?? '',
  network_url: process.env.NETWORK_URL ?? '',
  orderbook_depth: 10,
  instruments: ['ETHUSDC', 'BTCUSDC'],
};
