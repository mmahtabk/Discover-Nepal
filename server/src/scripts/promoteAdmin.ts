import { connectDb, disconnectDb } from '../config/db.js';
import { User } from '../models/user.model.js';

const email = process.argv[2] ?? '';

async function run(): Promise<void> {
  await connectDb();

  if (!email) {
    console.error('Usage: npm run promote:admin -- <email>');
    console.error('Example: npm run promote:admin -- you@example.com');
    await disconnectDb();
    process.exit(1);
  }

  const existing = await User.findOne({ email }).lean();
  if (!existing) {
    console.error(`[promote] no user found with email "${email}"`);
    console.error('Tip: list all users with: mongosh discover-nepal --eval \'db.users.find().toArray().map(u => u.email)\'');
    await disconnectDb();
    process.exit(1);
  }

  const res = await User.updateOne({ email }, { $set: { isAdmin: true } });
  if (res.modifiedCount === 0 && existing.isAdmin) {
    console.log(`[promote] "${email}" was already an admin — no change needed.`);
  } else {
    console.log(`[promote] "${email}" (${existing.name}) is now an admin.`);
  }

  await disconnectDb();
  process.exit(0);
}

run().catch((err) => {
  console.error('[promote] failed:', err);
  process.exit(1);
});