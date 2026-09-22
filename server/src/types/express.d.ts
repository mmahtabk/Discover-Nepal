import type { UserDoc } from '../models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

export {};