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
  showHero?: boolean;
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
    showHero: false,
    tagline: 'Toros por\nlas Calles',
    description:
      'Una de las tradiciones más emocionantes de las Fiestas de San Buenaventura. Los toros recorren las calles de Moraleja en un ambiente único.',
    heroImage: '/toro-victorino-lunes-13.jpg',
    color: '#c94040',
    stats: [],
    cards: [
      {
        id: 'bf1',
        title: 'Ganadería Victorino Martín',
        subtitle: 'Petrolero · N79 · G1',
        description: 'Toros por las calles de la Ganadería Victorino Martín. San Buenaventura 2026.',
        image: '/toro-victorino-lunes-13.jpg',
        tags: ['Toros por las calles', 'Victorino Martín'],
        badge: '13 Jul · 22:00h',
        meta: { date: 'Lunes 13 de Julio · 22:00h', location: 'Moraleja' },
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
