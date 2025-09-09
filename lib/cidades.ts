export interface CidadeGeo {
  lat: number;
  lon: number;
}

export const cidadeLatLon: Record<string, CidadeGeo> = {
  Cuiabá: { lat: -15.601, lon: -56.097 },
  "Várzea Grande": { lat: -15.646, lon: -56.132 },
  Rondonópolis: { lat: -16.467, lon: -54.638 },
  Sinop: { lat: -11.86, lon: -55.51 },
  "Tangará da Serra": { lat: -14.622, lon: -57.493 },
  Cáceres: { lat: -16.076, lon: -57.681 },
  "Barra do Garças": { lat: -15.893, lon: -52.257 },
  "Pontes e Lacerda": { lat: -15.226, lon: -59.335 },
  "Primavera do Leste": { lat: -15.555, lon: -54.281 },
  "Alta Floresta": { lat: -9.874, lon: -56.086 },
  "Lucas do Rio Verde": { lat: -13.057, lon: -55.909 },
  Sorriso: { lat: -12.542, lon: -55.721 },
  Juína: { lat: -11.372, lon: -58.737 },
  Diamantino: { lat: -14.403, lon: -56.436 },
  "Nova Mutum": { lat: -13.839, lon: -56.073 },
  Colíder: { lat: -10.813, lon: -55.461 },
  "Campo Verde": { lat: -15.545, lon: -55.163 },
  "Pontal do Araguaia": { lat: -15.854, lon: -52.004 },
  "Água Boa": { lat: -14.05, lon: -52.16 },
  "Guarantã do Norte": { lat: -9.962, lon: -54.912 },
  "Chapada dos Guimarães": { lat: -15.464, lon: -55.749 },
  "Mirassol d'Oeste": { lat: -15.675, lon: -58.094 },
  "Nova Xavantina": { lat: -14.677, lon: -52.35 },
  Poconé: { lat: -16.256, lon: -56.622 },
  Canarana: { lat: -13.551, lon: -52.27 },
  "Barra do Bugres": { lat: -15.073, lon: -57.182 },
  Brasnorte: { lat: -12.15, lon: -57.98 },
};

export const estadoMTBounding = {
  north: -9.0,
  south: -18.0,
  west: -61.4,
  east: -50.2,
};
