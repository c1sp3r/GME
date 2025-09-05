export const VEHICLE_BRANDS = [
  { id: 'peugeot', name: 'Peugeot', logo: '🦁' },
  { id: 'renault', name: 'Renault', logo: '🔷' },
  { id: 'volkswagen', name: 'Volkswagen', logo: '🚗' },
  { id: 'toyota', name: 'Toyota', logo: '🔴' },
  { id: 'hyundai', name: 'Hyundai', logo: '🔵' },
  { id: 'kia', name: 'Kia', logo: '⚪' },
  { id: 'dacia', name: 'Dacia', logo: '🟢' },
  { id: 'fiat', name: 'Fiat', logo: '🔶' },
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  peugeot: ['206', '207', '208', '301', '308', '2008', '3008', '5008', 'Partner'],
  renault: ['Clio 4', 'Clio 5', 'Symbol', 'Logan', 'Sandero', 'Duster', 'Kangoo'],
  volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'Caddy'],
  toyota: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Hilux'],
  hyundai: ['i10', 'i20', 'Accent', 'Elantra', 'Tucson', 'Santa Fe'],
  kia: ['Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento'],
  dacia: ['Sandero', 'Logan', 'Duster', 'Dokker'],
  fiat: ['Punto', 'Tipo', 'Panda', 'Doblo'],
};