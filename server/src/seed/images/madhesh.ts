/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const MADHESH_IMAGES: ImageMap = {
  'janaki-mandir': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Janaki_Mandir%2C_Janakpur_Nepal_01.jpg/1280px-Janaki_Mandir%2C_Janakpur_Nepal_01.jpg',
  'janakpur-mithila-trail': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Jadupatua_paintings_and_Madhubani_paintings.JPG/1280px-Jadupatua_paintings_and_Madhubani_paintings.JPG',
  'dhanushadham-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Dhanushadham_Govindapur_Janakpur_Dhanusha_Nepal_Rajesh_Dhungana_%283%29.jpg/1280px-Dhanushadham_Govindapur_Janakpur_Dhanusha_Nepal_Rajesh_Dhungana_%283%29.jpg',
  'ganga-sagar-janakpur': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Entrance_of_Vivah_Mandap%2C_Janakpur-September_22%2C_2016-IMG_7416.jpg/1280px-Entrance_of_Vivah_Mandap%2C_Janakpur-September_22%2C_2016-IMG_7416.jpg',
  'rajdevi-temple-rajbiraj': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/RAJDEVI_BHAGWATI.jpg/1280px-RAJDEVI_BHAGWATI.jpg',
  'chinnamasta-bhagawati': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Chinnamasta_Bhagawati_Temple%2C_Saptari.jpg/1280px-Chinnamasta_Bhagawati_Temple%2C_Saptari.jpg',
  'koshi-barrage': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Koshi_Bridge_1.JPG/1280px-Koshi_Bridge_1.JPG',
  'balmiki-ashram': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Balmiki_ashram_2.jpg',
  'gadhimai-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Gadhimai_Temple_%282%29.JPG/1280px-Gadhimai_Temple_%282%29.JPG',
  'simraungadh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Simroungarh_Toran_Dwar_Statue.jpg/1280px-Simroungarh_Toran_Dwar_Statue.jpg',
  'parsa-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Indian_pitta_at_Parsa_National_Park.jpg/1280px-Indian_pitta_at_Parsa_National_Park.jpg',
  'chandrapur-wetlands': null, // Chandrapur Wetlands (no confident photo found -> placeholder)
  'birgunj': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Ghantaghar_birgunj.jpg',
  'nijgadh-forest': null, // Nijgadh Forest Corridor (no confident photo found -> placeholder)
  'amlekhganj': null, // Amlekhganj (no confident photo found -> placeholder)
  'gaur-rautahat': null, // Gaur (no confident photo found -> placeholder)
  'jaleshwar-nath-temple': null, // Jaleshwar Nath Temple (no confident photo found -> placeholder)
  'bardibas': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Bardibas_Bazar.jpg',
  'manraja-bagmati': null, // Manraja & the Bagmati Riverbank (no confident photo found -> placeholder)
  'lahan-cardamom-bazaar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Lahan_Chowk.jpg/1280px-Lahan_Chowk.jpg',
};
