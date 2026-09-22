/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const KARNALI_IMAGES: ImageMap = {
  'rara-lake': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Rara_Lake%2C_Mugu%2C_Nepal.jpg/1280px-Rara_Lake%2C_Mugu%2C_Nepal.jpg',
  'rara-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Rara_5515_13.JPG/1280px-Rara_5515_13.JPG',
  'shey-phoksundo-lake': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Shey_Phoksundo_Lake%2CNepal.jpg/1280px-Shey_Phoksundo_Lake%2CNepal.jpg',
  'shey-phoksundo-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Summer_camp_for_caravans._Shey_Phoksundo_National_Park._-_panoramio.jpg/1280px-Summer_camp_for_caravans._Shey_Phoksundo_National_Park._-_panoramio.jpg',
  'upper-dolpo-trek': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Temple_founded_in_the_8th_century_under_cliff%2C_Dolpo%2C_Nepal_in_2014.jpg/1280px-Temple_founded_in_the_8th_century_under_cliff%2C_Dolpo%2C_Nepal_in_2014.jpg',
  'dunai': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Dunai%2C_Dolpo%2C_Nepal.JPG/1280px-Dunai%2C_Dolpo%2C_Nepal.JPG',
  'sinja-valley': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Narakot_Sinja_Valley.JPG/1280px-Narakot_Sinja_Valley.JPG',
  'chandannath-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Channdannath_and_Bhairabnath.jpg/1280px-Channdannath_and_Bhairabnath.jpg',
  'jumla-bazaar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/View_from_Jumla_Bazaar_-_The_Northern_Side_of_Jumla_-_panoramio.jpg/1280px-View_from_Jumla_Bazaar_-_The_Northern_Side_of_Jumla_-_panoramio.jpg',
  'junichaur': null, // Junichaur (no confident photo found -> placeholder)
  'kot-gauda-dailekh': null, // Kot Gauda (Dailekh) (no confident photo found -> placeholder)
  'kankre-bihar': null, // Kankre Bihar (no confident photo found -> placeholder)
  'bulbule': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Bulbule_Lake_01.JPG/1280px-Bulbule_Lake_01.JPG',
  'dungeshwar-cave': null, // Dungeshwar Cave (no confident photo found -> placeholder)
  'simikot': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Simikot_3.JPG/1280px-Simikot_3.JPG',
  'limi-valley': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Limi_Valley_Humla.jpg/1280px-Limi_Valley_Humla.jpg',
  'hilsa': null, // Hilsa & Kailash Gateway (no confident photo found -> placeholder)
  'tila-river-valley': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Tila_Valley_Jumla.JPG/1280px-Tila_Valley_Jumla.JPG',
  'narku': null, // Narku (no confident photo found -> placeholder)
  'kalika-temple-jumla': null, // Kalika Temple (Jumla) (no confident photo found -> placeholder)
};
