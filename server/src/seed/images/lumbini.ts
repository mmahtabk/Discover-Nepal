/**
 * Per-province image mapping (slug -> static image URL).
 *
 * Every URL is a fixed Wikimedia Commons thumbnail (hand-picked to match the
 * exact place); `null` entries have no confident photo yet and render as a
 * labeled placeholder via images/index.ts. No live image API is consulted
 * at render time.
 */

import type { ImageMap } from './types.js';

export const LUMBINI_IMAGES: ImageMap = {
  'lumbini-sacred-garden': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Lumbini_Maya_Devi_Temple_1.jpg/1280px-Lumbini_Maya_Devi_Temple_1.jpg',
  'maya-devi-temple': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Lumbini_Maya_Devi_Temple_2.jpg/1280px-Lumbini_Maya_Devi_Temple_2.jpg',
  'tilaurakot': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Tilaurakot%2C_Kapilvastu_Ancient_Shakya_Capital_01.jpg/1280px-Tilaurakot%2C_Kapilvastu_Ancient_Shakya_Capital_01.jpg',
  'kudan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Kudan_Budha_Taulihawa_Kapilvastu_Lumbini_Zone_Nepal_Rajesh_Dhungana_1_%282%29.jpg/1280px-Kudan_Budha_Taulihawa_Kapilvastu_Lumbini_Zone_Nepal_Rajesh_Dhungana_1_%282%29.jpg',
  'gotihawa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Gotihawa_Ashok_Pillar_Buddha_Kapilvastu_Lumbini_Zone_Nepal_Rajesh_Dhungana_%284%29.jpg/1280px-Gotihawa_Ashok_Pillar_Buddha_Kapilvastu_Lumbini_Zone_Nepal_Rajesh_Dhungana_%284%29.jpg',
  'niglihawa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Kanakmuni_Buddha_Park_Araurakot_Niglihawa_Kapilbastu_Nepal_Rajesh_Dhungana_%283%29.jpg/1280px-Kanakmuni_Buddha_Park_Araurakot_Niglihawa_Kapilbastu_Nepal_Rajesh_Dhungana_%283%29.jpg',
  'devadaha': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Pakari_Tree_%28Ficus_benjamina%29_Buddha_Tree_Pakari_Devadaha_Rupendehi_District_Nepal_Rajesh_Dhungana_%281%29.jpg/1280px-Pakari_Tree_%28Ficus_benjamina%29_Buddha_Tree_Pakari_Devadaha_Rupendehi_District_Nepal_Rajesh_Dhungana_%281%29.jpg',
  'lumbini-monastic-zone': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cambodian_Monastery_in_Lumbini%2C_2019-04-09.jpg/1280px-Cambodian_Monastery_in_Lumbini%2C_2019-04-09.jpg',
  'bhairahawa-siddharthanagar': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Siddharthanagar%2C_Nepal%2C_9_April_2019_1.jpg/1280px-Siddharthanagar%2C_Nepal%2C_9_April_2019_1.jpg',
  'tansen-palpa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Palpa_Durbar_%2CTansen_Palpa_01.jpg/1280px-Palpa_Durbar_%2CTansen_Palpa_01.jpg',
  'rani-mahal': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Palpa%2C_Ranighat_Palace%2C_Rani_Mahal%2C_Nepal.jpg/1280px-Palpa%2C_Ranighat_Palace%2C_Rani_Mahal%2C_Nepal.jpg',
  'resunga-hill': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Resunga_Yagyashala_%28land_of_oblation%29.jpg/1280px-Resunga_Yagyashala_%28land_of_oblation%29.jpg',
  'tamghas': null, // Tamghas (no confident photo found -> placeholder)
  'argha-arghakhanchi': null, // Argha & the Arghakhanchi Ridges (no confident photo found -> placeholder)
  'bardiya-national-park': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Mugger_crocodile_basking%2C_Bardiya_National_Park.jpg/1280px-Mugger_crocodile_basking%2C_Bardiya_National_Park.jpg',
  'tharu-cultural-villages': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Tharu_village_scene.jpg',
  'banke-national-park': null, // Banke National Park (no confident photo found -> placeholder)
  'deukhuri-valley': null, // Deukhuri Valley (no confident photo found -> placeholder)
  'ghorahi': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Historical_Siddhanath_well_Chaughara_Ghorahi_Dang_Nepal_Rajesh_Dhungana_%281%29.jpg/1280px-Historical_Siddhanath_well_Chaughara_Ghorahi_Dang_Nepal_Rajesh_Dhungana_%281%29.jpg',
  'thabang-rolpa': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Rolpa-Thabang%2C_a_Village_of_Rolpa._Its_a_historical_place._in_1996_Nepalese_people_war_was_started_from_here..jpg/1280px-Rolpa-Thabang%2C_a_Village_of_Rolpa._Its_a_historical_place._in_1996_Nepalese_people_war_was_started_from_here..jpg',
};
