import type { DestinationSeed } from './imageHelpers.js';
import { KOSHI_DESTINATIONS } from './destinations.koshi.js';
import { MADHESH_DESTINATIONS } from './destinations.madhesh.js';
import { BAGMATI_DESTINATIONS } from './destinations.bagmati.js';
import { GANDAKI_DESTINATIONS } from './destinations.gandaki.js';
import { LUMBINI_DESTINATIONS } from './destinations.lumbini.js';
import { KARNALI_DESTINATIONS } from './destinations.karnali.js';
import { SUDURPASHCHIM_DESTINATIONS } from './destinations.sudurpashchim.js';

/** All 140 destinations (20 per province, in official province-number order). */
export const DESTINATIONS: DestinationSeed[] = [
  ...KOSHI_DESTINATIONS,
  ...MADHESH_DESTINATIONS,
  ...BAGMATI_DESTINATIONS,
  ...GANDAKI_DESTINATIONS,
  ...LUMBINI_DESTINATIONS,
  ...KARNALI_DESTINATIONS,
  ...SUDURPASHCHIM_DESTINATIONS,
];

export const DESTINATION_TOTAL = DESTINATIONS.length;