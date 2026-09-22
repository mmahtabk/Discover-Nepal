import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { env } from '../config/env.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import type { JwtPayloadShape } from '../types/auth.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user: { _id: Types.ObjectId; email: string }): string {
  const payload: JwtPayloadShape = { sub: user._id.toString(), email: user.email };
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function publicUser(user: { _id: Types.ObjectId; name: string; email: string }) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length < 2) {
    throw ApiError.badRequest('Name is required (min 2 characters)');
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    throw ApiError.badRequest('A valid email is required');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash });

  const token = signToken(user);
  res.status(201).json(ApiResponse.ok({ token, user: publicUser(user) }));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as Record<string, unknown>;

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw ApiError.badRequest('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user);
  res.json(ApiResponse.ok({ token, user: publicUser(user) }));
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw ApiError.unauthorized();
  res.json(ApiResponse.ok(publicUser(user)));
});