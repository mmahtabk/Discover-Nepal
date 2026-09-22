import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let status = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error && 'name' in err && err.name === 'ValidationError') {
    status = 400;
    message = (err as Error & { message: string }).message;
  } else if (err instanceof Error) {
    if (err.message.startsWith('Cast to ObjectId failed')) {
      status = 400;
      message = 'Invalid identifier';
    } else {
      message = err.message;
    }
  }

  if (env.nodeEnv !== 'production') {
    console.error('[error]', err);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(details !== undefined ? { details } : {}),
  });
}