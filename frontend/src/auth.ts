/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT token generation
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
}

// User queries
export function getUserById(userId: number): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(userId) as User | undefined;
}

export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
}

export function createUser(
  fullName: string,
  email: string,
  passwordHash: string,
  phone?: string
): User {
  const stmt = db.prepare(
    'INSERT INTO users (fullName, email, passwordHash, phone) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(fullName, email, passwordHash, phone);
  return getUserById(result.lastInsertRowid as number) as User;
}

export function updateUserProfile(
  userId: number,
  fullName?: string,
  phone?: string
): User | undefined {
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (fullName !== undefined) {
    updates.push('fullName = ?');
    values.push(fullName);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    values.push(phone);
  }

  if (updates.length === 0) return getUserById(userId);

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(userId);

  const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getUserById(userId);
}
