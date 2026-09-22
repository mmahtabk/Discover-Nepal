import { KOSHI_IMAGES } from './koshi.js';
import { MADHESH_IMAGES } from './madhesh.js';
import { BAGMATI_IMAGES } from './bagmati.js';
import { GANDAKI_IMAGES } from './gandaki.js';
import { LUMBINI_IMAGES } from './lumbini.js';
import { KARNALI_IMAGES } from './karnali.js';
import { SUDURPASHCHIM_IMAGES } from './sudurpashchim.js';
import type { ImageMap } from './types.js';

/**
 * The single source of truth for destination images: `destinationSlug -> url`.
 *
 * Every entry is a fixed, human-verified Wikimedia Commons thumbnail. Entries
 * whose value is `null` have no confident photo yet — call
 * `resolveDestinationImage` (imageHelpers) to turn those into a labeled
 * placeholder card. No destination falls back to a live image API anymore.
 */
export const DESTINATION_IMAGES: ImageMap = {
  ...KOSHI_IMAGES,
  ...MADHESH_IMAGES,
  ...BAGMATI_IMAGES,
  ...GANDAKI_IMAGES,
  ...LUMBINI_IMAGES,
  ...KARNALI_IMAGES,
  ...SUDURPASHCHIM_IMAGES,
};

export type { ImageMap } from './types.js';
export { placeholderImageUrl } from './placeholder.js';