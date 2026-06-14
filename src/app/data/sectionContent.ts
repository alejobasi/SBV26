export interface SectionCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  badge?: string;
  meta?: {
    date?: string;
    hours?: string;
    price?: string;
    location?: string;
  };
}

export interface SectionData {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  heroImage: string;
  color: string;
  stats: { label: string; value: string }[];
  cards: SectionCard[];
}

const BASE = 'https://images.unsplash.com/photo-';
const Q = '?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
const img = (id: string) => `${BASE}${id}${Q}`;

export const SECTION_DATA: Record<string, SectionData> = {
  Events: {
    id: 'events',
    title: 'Eventos',
    emoji: '🎭',
    tagline: 'El Calendario Vivo\nde Moraleja',
    description:
      'A city that never stops celebrating. From ancient holy processions to modern music festivals, every week brings something unforgettable.',
    heroImage: img('1764267368768-3442cbf2a5c2'),
    color: '#d97706',
    stats: [
      { label: 'Eventos este mes', value: '24+' },
      { label: 'Festivales al año', value: '60+' },
      { label: 'Valoración media', value: '4.8★' },
    ],
    cards: [
      {
        id: 'ev1',
        title: 'Ejemplo de Evento',
        subtitle: 'Aquí irá el nombre del evento · Fecha',
        description: 'Aquí irá la descripción del evento cuando esté disponible.',
        image: img('1764267368768-3442cbf2a5c2'),
        tags: ['Ejemplo'],
        badge: 'Próximamente',
        meta: { date: 'Por confirmar', location: 'Moraleja' },
      },
    ],
  },

  Bullfighting: {
    id: 'bullfighting',
    title: 'Toros',
    emoji: '🐂',
    tagline: 'Arte Ancestral,\nTradición Viva',
    description:
      'Seville is the birthplace of modern bullfighting. A spectacle of courage, artistry, and passion that has defined Andalusian culture for three centuries.',
    heroImage: img('1740154787822-a96bc35c8ebc'),
    color: '#c94040',
    stats: [
      { label: 'Corridas por temporada', value: '20+' },
      { label: 'Año de fundación', value: '1761' },
      { label: 'Aforo del ruedo', value: '12,500' },
    ],
    cards: [
      {
        id: 'bf1',
        title: 'Ejemplo de Toros',
        subtitle: 'Aquí irá el nombre del evento · Fecha',
        description: 'Aquí irá la descripción del evento taurino cuando esté disponible.',
        image: img('1740154787822-a96bc35c8ebc'),
        tags: ['Ejemplo'],
        badge: 'Próximamente',
        meta: { date: 'Por confirmar', location: 'Plaza de Toros · Moraleja' },
      },
    ],
  },

  Nightlife: {
    id: 'nightlife',
    title: 'Peñas',
    emoji: '🎉',
    tagline: 'Las Peñas de\nMoraleja',
    description: 'Las peñas son el corazón de las fiestas de San Buenaventura.',
    heroImage: img('1565035010268-a3816f98589a'),
    color: '#16a34a',
    stats: [
      { label: 'Peñas', value: '10+' },
    ],
    cards: [
      {
        id: 'nl1',
        title: 'Ejemplo de Peña',
        subtitle: 'Aquí irá el nombre de la peña',
        description: 'Aquí irá la información de la peña cuando esté disponible.',
        image: img('1565035010268-a3816f98589a'),
        tags: ['Ejemplo'],
        badge: 'Próximamente',
        meta: { location: 'Moraleja' },
      },
      {
        id: 'nl2',
        title: 'Ejemplo de Peña 2',
        subtitle: 'Aquí irá el nombre de la peña',
        description: 'Aquí irá la información de la peña cuando esté disponible.',
        image: img('1727425812012-1173bb74591b'),
        tags: ['Ejemplo'],
        badge: 'Próximamente',
        meta: { location: 'Moraleja' },
      },
    ],
  },
};
