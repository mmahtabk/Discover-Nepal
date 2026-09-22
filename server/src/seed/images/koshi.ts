/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const KOSHI_IMAGES: ImageMap = {
  'sagarmatha-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Mount_Everest_and_Mount_Lhotse.jpg/1280px-Mount_Everest_and_Mount_Lhotse.jpg',
  'everest-base-camp-trek': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/View_of_Mount_Everest_from_Syangboche_Village%2C_during_Everest_Base_Camp_Trek_in_2023.jpg/1280px-View_of_Mount_Everest_from_Syangboche_Village%2C_during_Everest_Base_Camp_Trek_in_2023.jpg',
  'namche-bazaar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Namche_bazar.jpg/1280px-Namche_bazar.jpg',
  'tengboche-monastery': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Tengboche_Monastery.jpg/1280px-Tengboche_Monastery.jpg',
  'ilam-tea-estates': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Ilam_tea_garden.jpg/1280px-Ilam_tea_garden.jpg',
  'kanyam': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Kanyam%2C_Ilam%2C_Nepal.jpg/1280px-Kanyam%2C_Ilam%2C_Nepal.jpg',
  'antu-danda': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Antu_Danda%2CIllam.JPG/1280px-Antu_Danda%2CIllam.JPG',
  'pathibhara-devi-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Pathibhara_temple.jpg/1280px-Pathibhara_temple.jpg',
  'kanchenjunga-base-camp': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Kanchnjunga.jpg/1280px-Kanchnjunga.jpg',
  'phungling-taplejung': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Phungling.JPG/1280px-Phungling.JPG',
  'chiyo-bhanjyang': null, // Chiyo Bhanjyang (no confident photo found -> placeholder)
  'phidim': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Phidim_57400%2C_Nepal_-_panoramio.jpg/1280px-Phidim_57400%2C_Nepal_-_panoramio.jpg',
  'bhojpur': null, // Bhojpur Bazaar (no confident photo found -> placeholder)
  'halesi-mahadev': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Halesi_Mahadev_Temple.jpg/1280px-Halesi_Mahadev_Temple.jpg',
  'barahachhetra': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Barahachhetra_sapta_koshi.JPG/1280px-Barahachhetra_sapta_koshi.JPG',
  'koshi-tappu-wildlife-reserve': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Koshi_Tappu_Wildlife_Reserve-1148.jpg/1280px-Koshi_Tappu_Wildlife_Reserve-1148.jpg',
  'dhankuta': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Dhankuta_Bazaar_from_South.jpg/1280px-Dhankuta_Bazaar_from_South.jpg',
  'arun-valley': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/This_is_Arun_river_valley._View_towards_Hatiya._-_panoramio.jpg/1280px-This_is_Arun_river_valley._View_towards_Hatiya._-_panoramio.jpg',
  'makalu-base-camp': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/SP_at_Makalu_Base_Camp_%283852179714%29.jpg/1280px-SP_at_Makalu_Base_Camp_%283852179714%29.jpg',
  'chichila': null, // Chichila (no confident photo found -> placeholder)
};
