import { connectDb, disconnectDb } from '../config/db.js';
import { Province } from '../models/province.model.js';
import { Destination } from '../models/destination.model.js';
import { PROVINCES, OFFICIAL_PROVINCE_NUMBERS } from './data/provinces.js';
import { DESTINATIONS, DESTINATION_TOTAL } from './data/destinations.js';
import { DESTINATION_COORDS } from './data/coordinates.js';
import { resolveDestinationImage } from './data/imageHelpers.js';
import { VERIFIED_IMAGES } from './data/verifiedImages.js';

async function seed(): Promise<void> {
  await connectDb();

  console.log('[seed] clearing provinces & destinations…');
  await Promise.all([Province.deleteMany({}), Destination.deleteMany({})]);

  // 1) Provinces — write the official `number` from OFFICIAL_PROVINCE_NUMBERS.
  console.log(`[seed] inserting ${PROVINCES.length} provinces…`);
  const provinceDocs = await Province.insertMany(
    PROVINCES.map((p) => {
      const officialNumber = OFFICIAL_PROVINCE_NUMBERS[p.slug];
      if (officialNumber === undefined) {
        throw new Error(`[seed] no official number mapped for province slug '${p.slug}'`);
      }
      const imageUrl = VERIFIED_IMAGES[p.imageKey];
      if (!imageUrl) {
        throw new Error(`[seed] no verified image for province '${p.slug}' (imageKey='${p.imageKey}')`);
      }
      return {
        ...p,
        number: officialNumber,
        imageUrl,
      };
    }),
  );

  // 2) Slug → real ObjectId lookup map (NEVER array index / insertion order).
  const slugToId = new Map<string, string>();
  for (const doc of provinceDocs) {
    slugToId.set(doc.slug, doc._id.toString());
  }

  // 3) Destinations — static image URLs, resolved with diagnostics.
  console.log(`[seed] inserting ${DESTINATION_TOTAL} destinations…`);
  const destinationDocs = DESTINATIONS.map((d) => {
    const provinceId = slugToId.get(d.provinceSlug);
    if (!provinceId) {
      throw new Error(`[seed] no province slug '${d.provinceSlug}' for destination '${d.slug}'`);
    }
    const imageUrl = resolveDestinationImage(d);
    if (imageUrl.startsWith('data:image/svg+xml')) {
      console.warn(
        `[seed] ${d.slug} has NO real image — storing labeled placeholder (no confident Wikimedia photo was found for this destination).`,
      );
    }
    const coords = DESTINATION_COORDS[d.slug];
    if (!coords) {
      throw new Error(`[seed] no map coordinates for destination '${d.slug}'`);
    }
    return {
      name: d.name,
      slug: d.slug,
      provinceId,
      provinceSlug: d.provinceSlug,
      district: d.district,
      category: d.category,
      subtitle: d.subtitle,
      description: d.description,
      bestSeason: d.bestSeason,
      ...(d.elevationM !== undefined ? { elevationM: d.elevationM } : {}),
      lat: coords.lat,
      lng: coords.lng,
      imageUrl,
    };
  });
  await Destination.insertMany(destinationDocs);

  const withRealImage = destinationDocs.filter(
    (d) => !d.imageUrl.startsWith('data:image/svg+xml'),
  ).length;
  const placeholders = destinationDocs.length - withRealImage;
  console.log(`[seed] images: ${withRealImage} static Wikimedia/SVG URLs, ${placeholders} labeled placeholders (no live image API calls).`);

  const byProvince = new Map<string, number>();
  for (const d of destinationDocs) {
    byProvince.set(d.provinceSlug, (byProvince.get(d.provinceSlug) ?? 0) + 1);
  }

  console.log('\n[seed] done.');
  console.log(`  provinces:  ${provinceDocs.length}`);
  console.log(`  destinations: ${destinationDocs.length}`);
  for (const slug of Object.keys(OFFICIAL_PROVINCE_NUMBERS)) {
    const n = OFFICIAL_PROVINCE_NUMBERS[slug];
    const count = byProvince.get(slug);
    console.log(`    #${n} ${slug.padEnd(14)} -> ${count}`);
  }
}

seed()
  .then(() => disconnectDb())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  });