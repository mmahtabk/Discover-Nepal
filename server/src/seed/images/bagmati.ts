/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const BAGMATI_IMAGES: ImageMap = {
  'kathmandu-durbar-square': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg/1280px-Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg',
  'patan-durbar-square': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Nepal_Patan_Durbar_Square_10_%28full_res%29.jpg/1280px-Nepal_Patan_Durbar_Square_10_%28full_res%29.jpg',
  'bhaktapur-durbar-square': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Durbar_Square_Bhaktapur_Nepal_87.jpg/1280px-Durbar_Square_Bhaktapur_Nepal_87.jpg',
  'swayambhunath-stupa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Swayambhunath_Stupa_-Kathmandu_Nepal-0336.jpg/1280px-Swayambhunath_Stupa_-Kathmandu_Nepal-0336.jpg',
  'boudhanath-stupa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Boudha_Stupa_2018_04.jpg/1280px-Boudha_Stupa_2018_04.jpg',
  'pashupatinath-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Pashupatinath_Temple_27.jpg/1280px-The_Pashupatinath_Temple_27.jpg',
  'changu-narayan-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Changu_Narayan_%285244433170%29.jpg/1280px-Changu_Narayan_%285244433170%29.jpg',
  'thamel-kathmandu': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kathmandu%2C_Nepal%2C_Thamel_streets.jpg/1280px-Kathmandu%2C_Nepal%2C_Thamel_streets.jpg',
  'asan-tole': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Kathmandu-Asan-Annapurna-02-2007-gje.jpg/1280px-Kathmandu-Asan-Annapurna-02-2007-gje.jpg',
  'nagarkot': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Morning_view_of_Nagarkot_2017.jpg/1280px-Morning_view_of_Nagarkot_2017.jpg',
  'dhulikhel': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Swet_Bhairav_Temple_Khadpu_Srikhandapur_Dhulikhel_Nepal_Rajesh_Dhungana_%282%29.jpg',
  'panauti': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Panauti_temples.jpg/1280px-Panauti_temples.jpg',
  'namo-buddha': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Namo_Buddha_monastery.jpg/1280px-Namo_Buddha_monastery.jpg',
  'shivapuri-nagarjun-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Shivapuri_Nagarjun_National_Park.jpg/1280px-Shivapuri_Nagarjun_National_Park.jpg',
  'chitwan-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Chitwan_National_Park.jpg/1280px-Chitwan_National_Park.jpg',
  'sauraha': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Beautiful_sunset_view_from_Sauraha%2C_Chitwan.jpg/1280px-Beautiful_sunset_view_from_Sauraha%2C_Chitwan.jpg',
  'langtang-valley': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Langtang_village.jpg/1280px-Langtang_village.jpg',
  'gosaikunda': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Lake_Gosaikunda.jpg/1280px-Lake_Gosaikunda.jpg',
  'dolakha-bhimsen-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Dolakha_Bhimsen_Temple_Dolakha_Ramechap_Nepal_Rajesh_Dhungana_%283%29.jpg/1280px-Dolakha_Bhimsen_Temple_Dolakha_Ramechap_Nepal_Rajesh_Dhungana_%283%29.jpg',
  'sindhuli-gadhi': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Sindhuli_Gadhi_Fort_Gate_20180608A_GDK.jpg/1280px-Sindhuli_Gadhi_Fort_Gate_20180608A_GDK.jpg',
};
