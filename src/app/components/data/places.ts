export interface Place {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  address: string;
  hours: string;
  price: string;
  tags: string[];
  lat: number;
  lng: number;
}

export const CATEGORIES = ['All', 'Events', 'Bullfighting', 'Nightlife'];

export const CATEGORY_COLORS: Record<string, string> = {
  All: '#4a7c59',
  Events: '#d97706',
  Bullfighting: '#c94040',
  Culture: '#7c3aed',
  Food: '#d06b2f',
  Nightlife: '#16a34a',
  Parks: '#16a34a',
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  All: '🗺️',
  Events: '🎭',
  Bullfighting: '🐂',
  Culture: '🏛️',
  Food: '🍽️',
  Nightlife: '🎉',
  Parks: '🌿',
};

export const CATEGORY_LABELS: Record<string, string> = {
  All: 'Todo',
  Events: 'Eventos',
  Bullfighting: 'Toros',
  Culture: 'Cultura',
  Food: 'Gastronomía',
  Nightlife: 'Peña',
  Parks: 'Parques',
};

// Helper function to determine category from title
function getCategoryFromTitle(title: string): string {
  if (title.includes('Peña')) return 'Nightlife';
  if (title.includes('Plaza De Toros')) return 'Bullfighting';
  if (title.includes('Salida') || title.includes('Recinto Ferial')) return 'Events';
  if (title.includes('Farmacia') || title.includes('Centro de Salud')) return 'Culture';
  if (title.includes('Chupinazo')) return 'Events';
  if (title.includes('Encierros')) return 'Events';
  return 'Culture';
}

// Import data from peñas.json
import peñasData from '../../data/peñas.json';

interface PeñaItem {
  position: [number, number];
  title: string;
  info?: string;
  image?: string;
  color: string;
}

export const places: Place[] = (peñasData as PeñaItem[]).map((item, index) => ({
  id: String(index + 1),
  name: item.title,
  category: getCategoryFromTitle(item.title),
  subtitle: item.title.includes('Peña') ? 'Peña Local · Fiestas San Buenaventura' : 'Punto de Interés',
  description: item.info || `Ubicación: ${item.title}`,
  image: item.image || 'https://images.unsplash.com/photo-1533562141207-ec0379dc6b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  rating: 4.5,
  reviews: 50,
  address: item.title,
  hours: 'Abierto durante las fiestas',
  price: 'Gratis',
  tags: [item.title.includes('Peña') ? 'Peña' : 'Atracción', 'San Buenaventura'],
  lat: item.position[0],
  lng: item.position[1],
}));

