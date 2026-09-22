/** slug -> static Wikimedia image URL, or `null` for destinations awaiting a confident photo. */
export interface ImageMap {
  [slug: string]: string | null;
}