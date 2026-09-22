import { DESTINATION_IMAGES, placeholderImageUrl } from '../images/index.js';

export type Category = 'trek' | 'nature' | 'culture' | 'hidden-gem';

export const CATEGORIES: Category[] = ['trek', 'nature', 'culture', 'hidden-gem'];

export interface DestinationSeed {
  name: string;
  slug: string;
  provinceSlug: string; // must match a Province.slug (resolved to a real ObjectId at seed time)
  district: string;
  category: Category;
  subtitle: string;
  description: string;
  bestSeason: string;
  elevationM?: number;
  /**
   * @deprecated retained for source-data compatibility only.
   * Images are now resolved from the static `DESTINATION_IMAGES` map in
   * `seed/images/` — keywords are no longer used to build any URL.
   */
  keywords: string[];
  /**
   * @deprecated images are keyed by destination `slug` in `seed/images/`,
   * so per-destination overrides live in that map instead of here.
   */
  imageKey?: string;
}

/**
 * Resolve the static image URL for a destination.
 *
 * Source of truth: `seed/images/` (slug -> fixed Wikimedia thumbnail).
 * There is deliberately NO live image API anywhere in this path — LoremFlickr
 * was removed because it silently served identical fallback photos (e.g. a cat
 * statue) for every destination that lacked a verified image.
 *
 * Logging policy: this function is noisy on purpose. If a slug has no entry in
 * the curated map (i.e. someone added a destination and forgot an image) it
 * logs a loud warning and returns an honest, labeled placeholder card.
 */
export function resolveDestinationImage(dest: DestinationSeed, opts: { silent?: boolean } = {}): string {
  const url = DESTINATION_IMAGES[dest.slug];
  if (url) {
    return url;
  }
  if (!opts.silent) {
    const reasons: string[] = [];
    if (!(dest.slug in DESTINATION_IMAGES)) {
      reasons.push(
        `slug '${dest.slug}' is MISSING from the curated image map (seed/images/)`,
      );
    }
    if (DESTINATION_IMAGES[dest.slug] === null) {
      reasons.push('marked null: no confidently-matching Wikimedia photo could be found');
    }
    console.warn(
      `[image] ${dest.slug} -> PLACEHOLDER (${reasons.join('; ') || 'unknown reason'})`,
    );
  }
  return placeholderImageUrl(dest.name);
}