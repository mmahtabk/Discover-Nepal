export interface ProvinceSeed {
  name: string;
  nameNepali: string;
  slug: string;
  number: number;
  capital: string;
  areaKm2: number;
  population: number;
  districts: number;
  description: string;
  highlights: string[];
  imageKey: string;
}

/**
 * OFFICIAL Nepal province numbering — 1..7. Never derived from array index,
 * insertion order, or alphabetical sort. This single source is used by:
 *   - the seed script (writing Province.number)
 *   - the validate script (checking DB number matches)
 */
export const OFFICIAL_PROVINCE_NUMBERS: Record<string, number> = {
  koshi: 1,
  madhesh: 2,
  bagmati: 3,
  gandaki: 4,
  lumbini: 5,
  karnali: 6,
  sudurpashchim: 7,
} as const;

export const PROVINCES: ProvinceSeed[] = [
  {
    name: 'Koshi',
    nameNepali: 'कोशी',
    slug: 'koshi',
    number: 1,
    capital: 'Biratnagar',
    areaKm2: 25905,
    population: 4972021,
    districts: 14,
    description:
      'Nepal’s easternmost province, anchored by Mount Everest and the Sagarmatha National Park. From tea gardens in Ilam to the wild Koshi Tappu wetlands, this is a province of superlatives — highest peak, biggest wetland, and the birthplace of the country’s eastern hill culture.',
    highlights: ['Sagarmatha National Park (UNESCO)', 'Mt. Everest Base Camp', 'Ilam tea gardens', 'Koshi Tappu wildlife'],
    imageKey: 'sagarmatha-national-park',
  },
  {
    name: 'Madhesh',
    nameNepali: 'मधेश',
    slug: 'madhesh',
    number: 2,
    capital: 'Janakpur',
    areaKm2: 9661,
    population: 6126288,
    districts: 8,
    description:
      'The flat alluvial heart of the Terai — fertile plains, Mithila art, and the sacred city of Janakpur with its white marble Janaki Mandir. Steeped in the Ramayana, Madhesh is a cultural heartland whose temples and festivals draw pilgrims year-round.',
    highlights: ['Janaki Mandir', 'Mithila art & culture', 'Koshi Barrage', 'Parsa National Park'],
    imageKey: 'janaki-mandir',
  },
  {
    name: 'Bagmati',
    nameNepali: 'बागमती',
    slug: 'bagmati',
    number: 3,
    capital: 'Hetauda',
    areaKm2: 20300,
    population: 6084042,
    districts: 13,
    description:
      'Home to the Kathmandu Valley and seven UNESCO World Heritage monuments, Bagmati is Nepal’s cultural and political nerve centre. Beyond the capital lie Chitwan’s jungles, Langtang’s peaks, and hill towns like Nagarkot and Panauti.',
    highlights: ['Kathmandu Valley (7 UNESCO sites)', 'Chitwan National Park (UNESCO)', 'Pashupatinath & Boudhanath', 'Langtang Himalaya'],
    imageKey: 'kathmandu-durbar-square',
  },
  {
    name: 'Gandaki',
    nameNepali: 'गण्डकी',
    slug: 'gandaki',
    number: 4,
    capital: 'Pokhara',
    areaKm2: 21504,
    population: 2479745,
    districts: 11,
    description:
      'The mountain-adjacent postcard: Pokhara’s Phewa Lake beneath the Annapurna range, the trans-Himalayan Mustang, and the pilgrim town of Muktinath. Gandaki holds Nepal’s most beloved trekking routes — Poon Hill, Annapurna, Manang and Upper Mustang.',
    highlights: ['Phewa Lake & Pokhara', 'Annapurna region', 'Upper Mustang & Muktinath', 'Bandipur heritage town'],
    imageKey: 'phewa-lake',
  },
  {
    name: 'Lumbini',
    nameNepali: 'लुम्बिनी',
    slug: 'lumbini',
    number: 5,
    capital: 'Deukhuri',
    areaKm2: 22288,
    population: 5124225,
    districts: 12,
    description:
      'Sacred heart of the Buddhist world — the UNESCO-listed Lumbini Sacred Garden is where the Buddha was born. Western Nepal also brings Bardiya’s tall-grass jungles, the Kali Gandaki between Palpa’s hills, and the historic Karnali plains.',
    highlights: ['Lumbini & Maya Devi Temple (UNESCO)', 'Bardiya National Park', 'Rani Mahal, Palpa', 'Kapilvastu ruins'],
    imageKey: 'lumbini-sacred-garden',
  },
  {
    name: 'Karnali',
    nameNepali: 'कर्णाली',
    slug: 'karnali',
    number: 6,
    capital: 'Birendranagar',
    areaKm2: 27984,
    population: 1694889,
    districts: 10,
    description:
      'Nepal’s largest and most remote province — the least-visited, most pristine corner of the Himalaya. Turquoise Rara Lake, deep Shey Phoksundo, ancient Dolpo, and the Khas kingdom’s Sinja Valley await those willing to go far off the map.',
    highlights: ['Rara Lake & National Park', 'Shey Phoksundo Lake (Dolpo)', 'Simikot & Humla', 'Sinja Valley ruins'],
    imageKey: 'rara-lake',
  },
  {
    name: 'Sudurpashchim',
    nameNepali: 'सुदूरपश्चिम',
    slug: 'sudurpashchim',
    number: 7,
    capital: 'Godawari',
    areaKm2: 19539,
    population: 2711455,
    districts: 9,
    description:
      'The far west — a land of high grasslands, hidden apu peaks, and the Mahakali river valley. Khaptad’s carpet of wildflowers, Shuklaphanta’s tigers and swamp deer, and pilgrimage sites from Surma Sarovar to Patal Bhuvaneshwar make it Nepal’s last frontier.',
    highlights: ['Khaptad National Park', 'Shuklaphanta National Park', 'Ghodaghodi Lake (Ramsar)', 'Api–Saipal Himal'],
    imageKey: 'khaptad-national-park',
  },
];