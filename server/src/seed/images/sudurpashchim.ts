/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const SUDURPASHCHIM_IMAGES: ImageMap = {
  'khaptad-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Khaptad%2C_Khaptad_National_Park%2C_Nepal.jpg/1280px-Khaptad%2C_Khaptad_National_Park%2C_Nepal.jpg',
  'khaptad-baba-ashram': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Khaptad_Baba_Ashram.jpg/1280px-Khaptad_Baba_Ashram.jpg',
  'ghodaghodi-lake': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ghodaghodi_Lake%2C_Kailali.jpg',
  'shuklaphanta-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Suklaphata.JPG/1280px-Suklaphata.JPG',
  'dodhara-chandani-bridge': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Chadani-Dodhara_Bridge.JPG/1280px-Chadani-Dodhara_Bridge.JPG',
  'patal-bhuvaneshwar-cave': null, // Patal Bhuvaneshwar Cave (no confident photo found -> placeholder)
  'api-himal': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Api_Nampa.JPG/1280px-Api_Nampa.JPG',
  'saipal-himal': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Saipal_Himal.jpg/1280px-Saipal_Himal.jpg',
  'surma-sarovar': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Surma_Sarobar5.jpg',
  'sigana': null, // Sigana (no confident photo found -> placeholder)
  'silgadhi': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Saileswori_Temple..jpg',
  'dipayal': null, // Dipayal Silgadhi Corridor (no confident photo found -> placeholder)
  'chamliya': null, // Chamliya (no confident photo found -> placeholder)
  'krishnasar-conservation-area': null, // Krishnasar Conservation Area (no confident photo found -> placeholder)
  'bhimdatta-mahendranagar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Siddhanath_Temple_Tilachaur_Mahendranagar_Kanchanpur_Nepal_Rajesh_Dhungana_%286%29.jpg/1280px-Siddhanath_Temple_Tilachaur_Mahendranagar_Kanchanpur_Nepal_Rajesh_Dhungana_%286%29.jpg',
  'bedkot-lake': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bedkot_Lake.jpg',
  'tikapur-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Tikapur_park%2C_Kailali.jpg/1280px-Tikapur_park%2C_Kailali.jpg',
  'amargadhi-fort': null, // Amargadhi Fort (no confident photo found -> placeholder)
  'mangalsen': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Scene_from_Mangalsen%2C_Achham.jpg/1280px-Scene_from_Mangalsen%2C_Achham.jpg',
  'gelhi': null, // Gelhi (no confident photo found -> placeholder)
};
