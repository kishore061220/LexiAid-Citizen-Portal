/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'lexiaid.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      passwordHash TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      fileName TEXT NOT NULL,
      fileType TEXT,
      fileSize INTEGER,
      content TEXT,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analysis history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      documentId INTEGER,
      analysisType TEXT,
      summary TEXT,
      statutes TEXT,
      recommendations TEXT,
      analyzedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(documentId) REFERENCES documents(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_documents_userId ON documents(userId);
    CREATE INDEX IF NOT EXISTS idx_analysis_userId ON analysis_history(userId);
  `);
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: number;
  userId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  content: string;
  uploadedAt: string;
}

export interface AnalysisHistory {
  id: number;
  userId: number;
  documentId?: number;
  analysisType: string;
  summary: string;
  statutes: string;
  recommendations: string;
  analyzedAt: string;
}
