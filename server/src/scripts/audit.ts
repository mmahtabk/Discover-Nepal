import { connectDb, disconnectDb } from '../config/db.js';
import { Province } from '../models/province.model.js';
import { Destination } from '../models/destination.model.js';

interface Row {
  name: string;
  category: string;
  provinceNumber: number;
  provinceName: string;
  imageUrl: string;
}

function pad(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n);
}

async function audit(): Promise<void> {
  await connectDb();

  const provinces = await Province.find().sort({ number: 1 }).lean();
  const provinceNameBySlug = new Map(provinces.map((p) => [p.slug, p.name]));

  const destinations = await Destination.find().sort({ provinceId: 1, name: 1 }).lean();

  const rows: Row[] = destinations.map((d) => ({
    name: d.name,
    category: d.category,
    provinceNumber: 0, // filled after lookup
    provinceName: provinceNameBySlug.get(d.provinceSlug) ?? d.provinceSlug,
    imageUrl: d.imageUrl,
  }));

  const imgW = 60;
  console.log('\n==================== npm run audit ====================');
  console.log(
    `${pad('DESTINATION', 34)} ${pad('PROVINCE', 12)} ${pad('CATEGORY', 12)} ${pad('IMAGE URL', imgW)}`,
  );
  console.log('─'.repeat(34 + 1 + 12 + 1 + 12 + 1 + imgW));

  for (const province of provinces) {
    const inProvince = rows.filter((r) => r.provinceName === province.name);
    if (inProvince.length === 0) continue;
    const header = `├─ #${province.number} ${province.name} (${inProvince.length})`;
    console.log(header);
    for (const r of inProvince) {
      console.log(
        `${pad(`  ${r.name}`, 34)} ${pad(r.provinceName, 12)} ${pad(r.category, 12)} ${pad(r.imageUrl, imgW)}`,
      );
    }
  }

  console.log('─'.repeat(34 + 1 + 12 + 1 + 12 + 1 + imgW));
  console.log(`\n${destinations.length} destinations across ${provinces.length} provinces.`);
}

audit()
  .then(() => disconnectDb())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[audit] failed:', err);
    process.exit(1);
  });