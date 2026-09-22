import { app } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';

async function main(): Promise<void> {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`[server] Discover Nepal API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});