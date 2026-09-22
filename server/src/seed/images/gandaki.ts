/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const GANDAKI_IMAGES: ImageMap = {
  'phewa-lake': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Phewa_Lake_of_Pokhara_city.jpg/1280px-Phewa_Lake_of_Pokhara_city.jpg',
  'sarangkot': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg/1280px-View_of_Annapurna_South_and_Machapuchare_from_Sarangkot%2C_Nepal-WLV-1659.jpg',
  'world-peace-pagoda': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/World_Peace_Pagoda_Pokhara.jpg/1280px-World_Peace_Pagoda_Pokhara.jpg',
  'davis-falls-gupteshwor': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Davis_Falls_%28Patale_Chhango%29.jpg/1280px-Davis_Falls_%28Patale_Chhango%29.jpg',
  'begnas-rupa-tal': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Behind_Begnash_dam_of_Begnash_Tal_%28lake%29_Pokhara%2C_Nepal.jpg/1280px-Behind_Begnash_dam_of_Begnash_Tal_%28lake%29_Pokhara%2C_Nepal.jpg',
  'annapurna-base-camp': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Annapurna_I.jpg/1280px-Annapurna_I.jpg',
  'ghorepani-poon-hill': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Sunrise_from_Poon_Hill%2C_Ghorepani.jpg/1280px-Sunrise_from_Poon_Hill%2C_Ghorepani.jpg',
  'ghandruk': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Ghandruk%2C_Nepal.jpg/1280px-Ghandruk%2C_Nepal.jpg',
  'manang-village': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Manang_valley.jpg/1280px-Manang_valley.jpg',
  'tilicho-lake': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Tilicho_lake_Manang.jpg/1280px-Tilicho_lake_Manang.jpg',
  'thorong-la-pass': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Thorong_La_pass_%285416_m%29_-_Annapurna_Circuit%2C_Nepal_-_panoramio.jpg/1280px-Thorong_La_pass_%285416_m%29_-_Annapurna_Circuit%2C_Nepal_-_panoramio.jpg',
  'muktinath-temple': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Image_of_Muktinath_temple.jpg',
  'jomsom': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Jomsom%2C_Nepal.jpg/1280px-Jomsom%2C_Nepal.jpg',
  'kagbeni': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Kagbeni_Mustang_Nepal.jpg/1280px-Kagbeni_Mustang_Nepal.jpg',
  'upper-mustang-lo-manthang': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/The_kingdom_of_Lo%2C_Lomangthang%2C_Upper_Mustang_%28Pano%29.jpg/1280px-The_kingdom_of_Lo%2C_Lomangthang%2C_Upper_Mustang_%28Pano%29.jpg',
  'marpha': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Mustang-Marpha-02-2015-gje.jpg/1280px-Mustang-Marpha-02-2015-gje.jpg',
  'bandipur': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Bandipur%2C_Nepal-WLV-1911.jpg/1280px-Bandipur%2C_Nepal-WLV-1911.jpg',
  'gorkha-durbar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Gorakhkali_Temple_Gorkha_Durbar_Gorkha_Nepal_Rajesh_Dhungana_%287%29.jpg/1280px-Gorakhkali_Temple_Gorkha_Durbar_Gorkha_Nepal_Rajesh_Dhungana_%287%29.jpg',
  'manakamana-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Gorkha_Manakamana_Temple_%28cropped%29.jpg/1280px-Gorkha_Manakamana_Temple_%28cropped%29.jpg',
  'dhaulagiri-base-camp': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Dhaulagiri%2C_Nepal.jpg/1280px-Dhaulagiri%2C_Nepal.jpg',
};
