import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';

export async function adminOnly(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw ApiError.unauthorized();
    if (!req.user.isAdmin) throw ApiError.forbidden('Admin access required');
    next();
  } catch (err) {
    next(err);
  }
}