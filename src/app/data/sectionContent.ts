export interface SectionCard {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  /** 'contain' shows the full image letterboxed (use for flyers/posters with important edge text). Defaults to 'cover'. */
  fit?: 'cover' | 'contain';
  tags: string[];
  badge?: string;
  group?: string;
  meta?: {
    date?: string;
    hours?: string;
    price?: string;
    location?: string;
  };
}

export interface SectionGroup {
  id: string;
  label: string;
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
  groups?: SectionGroup[];
}

const BASE = 'https://images.unsplash.com/photo-';
const Q = '?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
const img = (id: string) => `${BASE}${id}${Q}`;

export const SECTION_DATA: Record<string, SectionData> = {
  Events: {
    id: 'events',
    title: 'Eventos',
    emoji: '🎭',
    showHero: false,
    tagline: 'El Calendario Vivo\nde Moraleja',
    description: '',
    heroImage: '/San-buenaventura-moraleja-90_230711104144.jpg',
    color: '#d97706',
    stats: [],
    groups: [
      { id: 'general', label: 'Generales' },
      { id: 'peñas', label: 'Eventos de Peñas' },
    ],
    cards: [
      {
        id: 'ev-grand-prix',
        title: 'Grand Prix',
        subtitle: 'Con la participación de las peñas de la localidad · Jueves 9 · 22:00h',
        description: 'Las peñas de la localidad se divertirán con juegos hinchables y vaquillas.',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['Peñas de Moraleja', 'Juegos hinchables', 'Vaquillas'],
        badge: 'Jueves 9 · 22:00h',
        group: 'general',
        meta: { date: 'Jueves 9 de Julio · 22:00h', location: 'Plaza de Toros (centro de la localidad)' },
      },
      {
        id: 'ev-verbena-syra',
        title: 'Verbena Popular · Orquesta Syra',
        subtitle: 'A cargo de la Orquesta Syra · Viernes 10 · 23:59h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['Orquesta Syra', 'Verbena'],
        badge: 'Viernes 10 · 23:59h',
        group: 'general',
        meta: { date: 'Viernes 10 · 23:59h', location: 'Plaza de La Encomienda' },
      },
      {
        id: 'ev-festival-djs',
        title: 'Festival DJs San Buenaventura 2026',
        subtitle: 'Nico Guerra, Carlos Chaparro y Les Castizos · Sábado 11 · 23:59h',
        image: '/flyer_san_buenaventura_2026_firmado.png',
        fit: 'contain',
        tags: ['Nico Guerra', 'Carlos Chaparro', 'Les Castizos'],
        group: 'general',
        meta: { date: 'Sábado 11 · 23:59h', location: 'Plaza de La Encomienda' },
      },
      {
        id: 'ev-verbena-vulkano',
        title: 'Verbena Popular · Orquesta Vulkano',
        subtitle: 'A cargo de la Orquesta Vulkano · Domingo 12 · 23:59h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['Orquesta Vulkano', 'Verbena'],
        badge: 'Domingo 12 · 23:59h',
        group: 'general',
        meta: { date: 'Domingo 12 · 23:59h', location: 'Plaza de La Encomienda' },
      },
      {
        id: 'ev-tardeo-dj-pulpo',
        title: 'Tardeo · DJ El Pulpo',
        subtitle: 'Lunes 13 · De 15:30 a 18:30h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['DJ El Pulpo', 'Tardeo'],
        badge: 'Lunes 13 · 15:30–18:30h',
        group: 'general',
        meta: { date: 'Lunes 13 · De 15:30 a 18:30h', location: 'Plaza Colón' },
      },
      {
        id: 'ev-concierto-templo-morbo',
        title: 'Concierto · El Templo del Morbo',
        subtitle: 'Aportado por la Comisión de Festejos SBV 2026 · Lunes 13 · 23:59h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['El Templo del Morbo', 'Comisión de Festejos SBV 2026'],
        badge: 'Lunes 13 · 23:59h',
        group: 'general',
        meta: { date: 'Lunes 13 · 23:59h', location: 'Plaza de La Encomienda' },
      },
      {
        id: 'ev-tardeo-paco-santos',
        title: 'Tardeo · Paco Santos Music',
        subtitle: 'Martes 14 · De 15:30 a 18:30h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['Paco Santos Music', 'Tardeo'],
        badge: 'Martes 14 · 15:30–18:30h',
        group: 'general',
        meta: { date: 'Martes 14 · De 15:30 a 18:30h', location: 'C/ Gabriel y Galán, Plaza de España (lateral Ayuntamiento)' },
      },
      {
        id: 'ev-charanga-clave-de-sol',
        title: 'Charanga "Clave de Sol"',
        subtitle: 'Todas las madrugadas · 04:00h',
        image: '/San-buenaventura-moraleja-90_230711104144.jpg',
        tags: ['Charanga', 'Clave de Sol'],
        badge: 'Todas las madrugadas · 04:00h',
        group: 'general',
        meta: { date: 'Todas las madrugadas · 04:00h', location: 'Plazuela Victoriano Revelo (junto al Estanco)' },
      },
      {
        id: 'ev-peña-lcl-sunset',
        title: 'LCL Sunset',
        subtitle: 'Peña El Local · Domingo 12 · 18:00h',
        image: '/PeñaElLocalDomingoEvento.jpg',
        tags: ['Peña El Local'],
        badge: 'Domingo 12 · 18:00h',
        group: 'peñas',
        meta: { date: 'Domingo 12 · 18:00h', location: 'C/ Capitán Domínguez, 14' },
      },
      {
        id: 'ev-peña-lcl-afterparty',
        title: 'LCL After Party',
        subtitle: 'Peña El Local · Domingo 12 · 01:00h',
        image: '/PeñaElLocalDomingoNocheEvento.jpg',
        tags: ['Peña El Local'],
        badge: 'Domingo 12 · 01:00h',
        group: 'peñas',
        meta: { date: 'Domingo 12 · 01:00h', location: 'Moraleja' },
      },
      {
        id: 'ev-peña-preocupaos-parade',
        title: 'Preocupaos Parade 2026',
        subtitle: 'Peña Los Preocupaos · 11 de Julio · 19:30h',
        image: '/PeñaPreocupadosEventos.jpg',
        tags: ['Peña Los Preocupaos'],
        badge: '11 Jul · 19:30h',
        group: 'peñas',
        meta: { date: '11 de Julio · 19:30h', location: 'Plaza de España (Ayuntamiento)' },
      },
      {
        id: 'ev-peña-mini-compes',
        title: 'Mini Compes',
        subtitle: 'Peña Los Compes · Domingo 12 · 01:00h',
        image: '/peñaCompesEvento.jpg',
        tags: ['Peña Los Compes'],
        badge: 'Domingo 12 · 01:00h',
        group: 'peñas',
        meta: { date: 'Domingo 12 · 01:00h', location: 'Moraleja' },
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
    groups: [
      { id: 'calles', label: 'Toros por las Calles' },
      { id: 'plaza', label: 'Corridas y Festejos' },
    ],
    cards: [
      {
        id: 'bf1',
        title: 'Ganadería Victorino Martín',
        subtitle: 'Petrolero · N79 · G1',
        description: 'Toros por las calles de la Ganadería Victorino Martín. San Buenaventura 2026.',
        image: '/toro-victorino-lunes-13.jpg',
        tags: ['Toros por las calles', 'Victorino Martín'],
        badge: '13 Jul · 22:00h',
        group: 'calles',
        meta: { date: 'Lunes 13 de Julio · 22:00h', location: 'Moraleja' },
      },
      {
        id: 'bf-corrida-sabado',
        title: 'Corrida de Toros',
        subtitle: 'Ganadería Adolfo Martín · Sábado 11 · 19:00h',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Manuel Escribano', 'Morenito de Aranda', 'Alejandro Mora'],
        badge: 'Sábado 11 · 19:00h',
        group: 'plaza',
        meta: { date: 'Sábado 11 · 19:00h', location: 'Plaza de Toros de Moraleja' },
      },
      {
        id: 'bf-rejones-domingo',
        title: 'Corrida de Rejones',
        subtitle: 'Ganadería Monteviejo · Domingo 12 · 19:00h',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Andy Cartagena', 'João Moura Caetano', 'Andrés Romero'],
        badge: 'Domingo 12 · 19:00h',
        group: 'plaza',
        meta: { date: 'Domingo 12 · 19:00h', location: 'Plaza de Toros de Moraleja' },
      },
      {
        id: 'bf-novillada-lunes',
        title: 'Novillada con Picadores',
        subtitle: 'Ganadería Carmen Valiente · Lunes 13 · 19:30h',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Jorge Hurtado', 'Ignacio Garibay'],
        badge: 'Lunes 13 · 19:30h',
        group: 'plaza',
        meta: { date: 'Lunes 13 · 19:30h', location: 'Plaza de Toros de Moraleja' },
      },
      {
        id: 'bf-recortes-martes',
        title: 'Concurso de Recortes',
        subtitle: 'Martes 14 · 19:30h',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Recortadores'],
        badge: 'Martes 14 · 19:30h',
        group: 'plaza',
        meta: { date: 'Martes 14 · 19:30h', location: 'Plaza de Toros de Moraleja' },
      },
      {
        id: 'bf-granprix-jueves',
        title: 'Gran Prix',
        subtitle: 'Jueves 9',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Espectáculo taurino'],
        badge: 'Jueves 9',
        group: 'plaza',
        meta: { date: 'Jueves 9', location: 'Plaza de Toros de Moraleja' },
      },
      {
        id: 'bf-tentadero-miercoles',
        title: 'Tentadero',
        subtitle: 'Miércoles 8',
        image: '/fotofestejospredeterminada.jpg',
        tags: ['Espectáculo taurino'],
        badge: 'Miércoles 8',
        group: 'plaza',
        meta: { date: 'Miércoles 8', location: 'Plaza de Toros de Moraleja' },
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
