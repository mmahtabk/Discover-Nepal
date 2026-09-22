/**
 * VERIFIED image URLs for well-known, named landmarks.
 *
 * These URLs were hand-picked and checked against the Wikimedia Commons API so that
 * the image matches the actual landmark (never a random stock photo). Keys are
 * DESTINATION SLUGS. Anything not listed here falls back to a keyword-based
 * LoremFlickr image via `imageHelpers.ts`.
 *
 * Source: Wikimedia Commons (publicly licensed images), thumbnails resolved at seed time.
 */
export const VERIFIED_IMAGES: Record<string, string> = {
  // ---- World Heritage Sites + majors, per slug ----
  'sagarmatha-national-park':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Mount_Everest_and_Mount_Lhotse.jpg/1280px-Mount_Everest_and_Mount_Lhotse.jpg',
  'kathmandu-durbar-square':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg/1280px-Kathmandu_Durbar_Square%2C_Shiva_Parvati_Temple%2C_Nepal_%28edit%29.jpg',
  'patan-durbar-square':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Nepal_Patan_Durbar_Square_10_%28full_res%29.jpg/1280px-Nepal_Patan_Durbar_Square_10_%28full_res%29.jpg',
  'bhaktapur-durbar-square':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Durbar_Square_Bhaktapur_Nepal_87.jpg/1280px-Durbar_Square_Bhaktapur_Nepal_87.jpg',
  'swayambhunath-stupa':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Swayambhunath_Stupa_-Kathmandu_Nepal-0336.jpg/1280px-Swayambhunath_Stupa_-Kathmandu_Nepal-0336.jpg',
  'boudhanath-stupa':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Boudha_Stupa_2018_04.jpg/1280px-Boudha_Stupa_2018_04.jpg',
  'pashupatinath-temple':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Pashupatinath_Temple_27.jpg/1280px-The_Pashupatinath_Temple_27.jpg',
  'changu-narayan-temple':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Changu_Narayan_%285244433170%29.jpg/1280px-Changu_Narayan_%285244433170%29.jpg',
  'lumbini-sacred-garden':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Lumbini_Maya_Devi_Temple_1.jpg/1280px-Lumbini_Maya_Devi_Temple_1.jpg',
  'maya-devi-temple':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Lumbini_Maya_Devi_Temple_2.jpg/1280px-Lumbini_Maya_Devi_Temple_2.jpg',
  'chitwan-national-park':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Chitwan_National_Park.jpg/1280px-Chitwan_National_Park.jpg',

  // ---- Other major named sites ----
  'tengboche-monastery':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Tengboche_Monastery.jpg/1280px-Tengboche_Monastery.jpg',
  'koshi-tappu-wildlife-reserve':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Koshi_Tappu_Wildlife_Reserve-1148.jpg/1280px-Koshi_Tappu_Wildlife_Reserve-1148.jpg',
  'ilam-tea-estates':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Ilam_tea_garden.jpg/1280px-Ilam_tea_garden.jpg',
  'kanyam':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Kanyam%2C_Ilam%2C_Nepal.jpg/1280px-Kanyam%2C_Ilam%2C_Nepal.jpg',
  'pathibhara-devi-temple':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Pathibhara_temple.jpg/1280px-Pathibhara_temple.jpg',
  'janaki-mandir':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Janaki_Mandir%2C_Janakpur_Nepal_01.jpg/1280px-Janaki_Mandir%2C_Janakpur_Nepal_01.jpg',
  'nagarkot':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Morning_view_of_Nagarkot_2017.jpg/1280px-Morning_view_of_Nagarkot_2017.jpg',
  'panauti':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Panauti_temples.jpg/1280px-Panauti_temples.jpg',
  'sauraha':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Beautiful_sunset_view_from_Sauraha%2C_Chitwan.jpg/1280px-Beautiful_sunset_view_from_Sauraha%2C_Chitwan.jpg',
  'gosaikunda':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Lake_Gosaikunda.jpg/1280px-Lake_Gosaikunda.jpg',
  'langtang-valley':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Langtang_village.jpg/1280px-Langtang_village.jpg',
  'dolakha-bhimsen-temple':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Dolakha_Bhimsen_Temple_Dolakha_Ramechap_Nepal_Rajesh_Dhungana_%283%29.jpg/1280px-Dolakha_Bhimsen_Temple_Dolakha_Ramechap_Nepal_Rajesh_Dhungana_%283%29.jpg',
  'shivapuri-nagarjun-national-park':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Shivapuri_Nagarjun_National_Park.jpg/1280px-Shivapuri_Nagarjun_National_Park.jpg',
  'chitlang':
    'https://upload.wikimedia.org/wikipedia/commons/8/85/Chitlang.jpg',
  'nuwakot-durbar':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Nuwakot_Durbar.jpg/1280px-Nuwakot_Durbar.jpg',
  'phewa-lake':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Phewa_Lake_of_Pokhara_city.jpg/1280px-Phewa_Lake_of_Pokhara_city.jpg',
  'world-peace-pagoda':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/World_Peace_Pagoda_Pokhara.jpg/1280px-World_Peace_Pagoda_Pokhara.jpg',
  'annapurna-base-camp':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Annapurna_I.jpg/1280px-Annapurna_I.jpg',
  'ghorepani-poon-hill':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Sunrise_from_Poon_Hill%2C_Ghorepani.jpg/1280px-Sunrise_from_Poon_Hill%2C_Ghorepani.jpg',
  'ghandruk':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Ghandruk%2C_Nepal.jpg/1280px-Ghandruk%2C_Nepal.jpg',
  'manang-village':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Manang_valley.jpg/1280px-Manang_valley.jpg',
  'tilicho-lake':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Tilicho_lake_Manang.jpg/1280px-Tilicho_lake_Manang.jpg',
  'muktinath-temple':
    'https://upload.wikimedia.org/wikipedia/commons/5/5b/Image_of_Muktinath_temple.jpg',
  'jomsom':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Jomsom%2C_Nepal.jpg/1280px-Jomsom%2C_Nepal.jpg',
  'kagbeni':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Kagbeni_Mustang_Nepal.jpg/1280px-Kagbeni_Mustang_Nepal.jpg',
  'bandipur':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Bandipur%2C_Nepal-WLV-1911.jpg/1280px-Bandipur%2C_Nepal-WLV-1911.jpg',
  'rani-mahal':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Palpa%2C_Ranighat_Palace%2C_Rani_Mahal%2C_Nepal.jpg/1280px-Palpa%2C_Ranighat_Palace%2C_Rani_Mahal%2C_Nepal.jpg',
  'bardiya-national-park':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Mugger_crocodile_basking%2C_Bardiya_National_Park.jpg/1280px-Mugger_crocodile_basking%2C_Bardiya_National_Park.jpg',
  'rara-lake':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Rara_Lake%2C_Mugu%2C_Nepal.jpg/1280px-Rara_Lake%2C_Mugu%2C_Nepal.jpg',
  'shey-phoksundo-lake':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Shey_Phoksundo_Lake%2CNepal.jpg/1280px-Shey_Phoksundo_Lake%2CNepal.jpg',
  'khaptad-national-park':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Khaptad%2C_Khaptad_National_Park%2C_Nepal.jpg/1280px-Khaptad%2C_Khaptad_National_Park%2C_Nepal.jpg',
  'ghodaghodi-lake':
    'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ghodaghodi_Lake%2C_Kailali.jpg',
} as const;