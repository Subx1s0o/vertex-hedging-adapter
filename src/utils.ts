import { config } from './config';

export interface InstrumentMapping {
  original: string;
  vertex: string;
}

export function formatToVertexInstrument(instrument: string) {
  const baseAsset = instrument.replace(/USDC$/, '');
  return `${baseAsset}-PERP_USDC`;
}

export function formatFromVertexInstrument(instrument: string) {
  instrument = instrument.replace('-PERP', '');
  instrument = instrument.replace('_', '');
  return instrument;
}

export function findMatchingInstruments(markets: any): InstrumentMapping[] {
  return config.instruments
    .map((instrument) => {
      const vertexFormat = formatToVertexInstrument(instrument);

      if (markets.includes(vertexFormat)) {
        return {
          original: instrument,
          vertex: vertexFormat,
        };
      }
      return null;
    })
    .filter((mapping): mapping is InstrumentMapping => mapping !== null);
}
