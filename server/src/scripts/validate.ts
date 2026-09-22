import { connectDb, disconnectDb } from '../config/db.js';
import { Province } from '../models/province.model.js';
import { Destination } from '../models/destination.model.js';
import { PROVINCES, OFFICIAL_PROVINCE_NUMBERS } from '../seed/data/provinces.js';
import { DESTINATIONS, DESTINATION_TOTAL } from '../seed/data/destinations.js';
import { DESTINATION_COORDS } from '../seed/data/coordinates.js';
import { resolveDestinationImage } from '../seed/data/imageHelpers.js';

interface Issue {
  kind: string;
  message: string;
}

function expectedProvinceCount(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const d of DESTINATIONS) {
    map[d.provinceSlug] = (map[d.provinceSlug] ?? 0) + 1;
  }
  return map;
}

async function validate(): Promise<number> {
  await connectDb();
  const issues: Issue[] = [];
  const expectedCounts = expectedProvinceCount();

  // ---- Source-data sanity (before DB) ----
  const expectedSlugs = new Set(PROVINCES.map((p) => p.slug));
  const usedSlugs = new Set(DESTINATIONS.map((d) => d.provinceSlug));
  for (const slug of usedSlugs) {
    if (!expectedSlugs.has(slug)) {
      issues.push({ kind: 'seed', message: `destination references unknown provinceSlug '${slug}'` });
    }
  }
  for (const slug of expectedSlugs) {
    if (!usedSlugs.has(slug)) {
      issues.push({ kind: 'seed', message: `province '${slug}' has zero destinations in seed data` });
    }
  }
  const seedSlugs = new Set<string>();
  for (const d of DESTINATIONS) {
    if (seedSlugs.has(d.slug)) {
      issues.push({ kind: 'seed', message: `duplicate destination slug in seed data: '${d.slug}'` });
    }
    seedSlugs.add(d.slug);
  }
  if (DESTINATIONS.length !== DESTINATION_TOTAL) {
    issues.push({ kind: 'seed', message: 'DESTINATION_TOTAL mismatch' });
  }
  // ---- Source-data map coordinates ----
  for (const d of DESTINATIONS) {
    const coords = DESTINATION_COORDS[d.slug];
    if (!coords) {
      issues.push({
        kind: 'seed',
        message: `destination '${d.slug}' has NO map coordinates — add to DESTINATION_COORDS`,
      });
      continue;
    }
    if (!(coords.lat >= 25.5 && coords.lat <= 31 && coords.lng >= 79.5 && coords.lng <= 89)) {
      issues.push({
        kind: 'seed',
        message: `destination '${d.slug}' has out-of-range coordinates (${coords.lat}, ${coords.lng})`,
      });
    }
  }
  // ---- Source-data image health (missing / placeholder-service / cross dupes) ----
  const PLACEHOLDER_SERVICES = [
    /loremflickr\.com/i,
    /picsum\.photos/i,
    /placehold\.co/i,
    /via\.placeholder\.com/i,
    /dummyimage\.com/i,
    /fakeimg\.pl/i,
    /placeholder\.imgix\.net/i,
  ];
  const isPlaceholderService = (url: string) => PLACEHOLDER_SERVICES.some((re) => re.test(url));

  const expectedUrls = new Map<string, string>();
  const expectedByUrl = new Map<
    string,
    { slug: string; province: string; category: string }
  >();
  for (const d of DESTINATIONS) {
    const url = resolveDestinationImage(d);
    if (!url || url.trim() === '') {
      issues.push({ kind: 'image', message: `seed: destination '${d.slug}' has a MISSING image URL` });
      continue;
    }
    if (isPlaceholderService(url)) {
      issues.push({
        kind: 'image',
        message: `seed: destination '${d.slug}' image URL is a placeholder-service URL (${url.slice(0, 80)}…) — use a static Wikimedia URL or a labeled data-url placeholder`,
      });
    }
    const prev = expectedUrls.get(url);
    if (prev) {
      issues.push({
        kind: 'image',
        message: `seed: destinations '${prev}' and '${d.slug}' resolve to the SAME image URL`,
      });
    } else {
      expectedUrls.set(url, d.slug);
    }

    const record = expectedByUrl.get(url);
    if (record) {
      // Per spec: flag a URL repeated across destinations that are in DIFFERENT
      // categories or provinces (the classic "one cat photo everywhere" failure).
      const crossCategoryProvince =
        record.province !== d.provinceSlug || record.category !== d.category;
      const metaNote = crossCategoryProvince
        ? `in a different province/category`
        : 'with the same province & category (still suspicious)';
      issues.push({
        kind: 'image',
        message: `seed: '${url.slice(0, 60)}' is duplicated by '${record.slug}' and '${d.slug}' ${metaNote}`,
      });
    } else {
      expectedByUrl.set(url, {
        slug: d.slug,
        province: d.provinceSlug,
        category: d.category,
      });
    }
  }

  // ---- DB: provinces ----
  const provinces = await Province.find().sort({ number: 1 }).lean();
  if (provinces.length !== PROVINCES.length) {
    issues.push({
      kind: 'province',
      message: `expected ${PROVINCES.length} provinces, found ${provinces.length}`,
    });
  }

  const dbNumbers = new Set<number>();
  for (const p of provinces) {
    const official = OFFICIAL_PROVINCE_NUMBERS[p.slug];
    if (official === undefined) {
      issues.push({ kind: 'province', message: `DB province '${p.slug}' has no official mapping` });
    } else if (p.number !== official) {
      issues.push({
        kind: 'province',
        message: `Province '${p.slug}' has number ${p.number} in DB but official number is ${official}`,
      });
    }
    if (dbNumbers.has(p.number)) {
      issues.push({ kind: 'province', message: `duplicate province number ${p.number} in DB` });
    }
    dbNumbers.add(p.number);
  }
  const sorted = provinces.every((p, i) => i === 0 || provinces[i - 1]!.number < p.number);
  if (!sorted) {
    issues.push({ kind: 'province', message: 'DB provinces are not sorted by number ascending' });
  }

  // ---- DB: destinations -> province linkage ----
  const destinations = await Destination.find().populate('provinceId', 'slug number').lean();
  if (destinations.length !== DESTINATIONS.length) {
    issues.push({
      kind: 'destination',
      message: `expected ${DESTINATIONS.length} destinations, found ${destinations.length}`,
    });
  }

  const countByProvince: Record<string, number> = {};
  for (const d of destinations) {
    const province = d.provinceId as unknown as { slug: string; number: number } | null;
    if (!province) {
      issues.push({ kind: 'destination', message: `destination '${d.slug}' has NO resolvable provinceId` });
      continue;
    }
    if (typeof d.lat !== 'number' || typeof d.lng !== 'number') {
      issues.push({
        kind: 'destination',
        message: `destination '${d.slug}' in DB has NO lat/lng coordinates`,
      });
    }
    countByProvince[province.slug] = (countByProvince[province.slug] ?? 0) + 1;
    if (province.slug !== d.provinceSlug) {
      issues.push({
        kind: 'destination',
        message: `destination '${d.slug}' provinceId resolves to province '${province.slug}' but its provinceSlug is '${d.provinceSlug}'`,
      });
    }
    const official = OFFICIAL_PROVINCE_NUMBERS[province.slug];
    if (official !== undefined && province.number !== official) {
      issues.push({
        kind: 'destination',
        message: `destination '${d.slug}' links to province ${province.slug} whose DB number ${province.number} != official ${official}`,
      });
    }
  }
  for (const [slug, expected] of Object.entries(expectedCounts)) {
    const found = countByProvince[slug] ?? 0;
    if (found !== expected) {
      issues.push({
        kind: 'destination',
        message: `province '${slug}' should have ${expected} destinations, DB has ${found}`,
      });
    }
  }

  // ---- DB: image URL uniqueness ----
  const urlMap = new Map<string, string>();
  for (const d of destinations) {
    const prev = urlMap.get(d.imageUrl);
    if (prev) {
      issues.push({
        kind: 'image',
        message: `DB destinations '${prev}' and '${d.slug}' share the identical imageUrl`,
      });
    } else {
      urlMap.set(d.imageUrl, d.slug);
    }
  }

  // ---- Report ----
  console.log('\n==================== npm run validate ====================');
  console.log(`provinces:    ${provinces.length}   (expected ${PROVINCES.length})`);
  console.log(`destinations: ${destinations.length}   (expected ${DESTINATIONS.length})`);
  console.log('-----------------------------------------------------------');

  if (issues.length === 0) {
    console.log('\n✔ VALIDATION PASSED — 0 issues. All province/linkage/image checks OK.');
    return 0;
  }

  console.log(`\n✘ VALIDATION FAILED — ${issues.length} issue(s):`);
  for (const [i, issue] of issues.entries()) {
    console.log(`  ${i + 1}. [${issue.kind}] ${issue.message}`);
  }
  return 1;
}

validate()
  .then((code) => disconnectDb().then(() => process.exit(code)))
  .catch((err) => {
    console.error('[validate] crashed:', err);
    process.exit(1);
  });