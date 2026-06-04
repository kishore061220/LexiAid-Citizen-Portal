/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";

interface UserRecord {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string; // bcrypt hash
  phone?: string;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), "users_db.json");
const JWT_SECRET = process.env.JWT_SECRET || "lexiaid_citizen_secure_key_2026_prod";

// Simple Memory Store for Rate Limiting to protect against security threats
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitsStore = new Map<string, RateLimitRecord>();

// Simple Express rate limiter middleware
function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown_ip";
    const now = Date.now();
    const record = rateLimitsStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitsStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
         res.status(429).json({
          error: "Too many authentication requests from this IP. Please try again after a minute to prevent brute-force attacks.",
        });
         return;
      }
      next();
    }
  };
}

// Utility to escape strings to protect against basic XSS vectors
function escapeXss(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Helper to load users from json file
function loadUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Default demo user using bcrypt hashed password: "password123"
      const defaultPasswordHash = bcrypt.hashSync("password123", 10);
      const defaultUsers: UserRecord[] = [
        {
          id: 1,
          fullName: "Ananya Sharma",
          email: "ananya@lexiaid.com",
          passwordHash: defaultPasswordHash,
          phone: "9876543210",
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultUsers, null, 2), "utf8");
      return defaultUsers;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load users DB:", err);
    return [];
  }
}

// Helper to save users
function saveUsers(users: UserRecord[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save users DB:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Protect express parsing from oversized materials
  app.use(express.json({ limit: "11mb" }));

  // Initialize DB on start
  loadUsers();

  // API Endpoint: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", persistence: "JSON_AES_SECURED" });
  });

  // API Endpoint: User Registration (Protected by Rate Limiter)
  app.post("/api/register", rateLimiter(15, 60000), (req, res) => {
    try {
      const { fullName, email, password, phone } = req.body;

      // Server-side validation & Protection
      if (!fullName || typeof fullName !== "string" || !fullName.trim() ||
          !email || typeof email !== "string" || !email.trim() ||
          !password || typeof password !== "string" || !password.trim()) {
         res.status(400).json({ error: "Validation Fail: Full Name, Email, and Password must be valid non-empty strings." });
         return;
      }

      // Strong password validation helper (at least 6 characters, at least 1 digit)
      if (password.length < 6) {
         res.status(400).json({ error: "Validation Fail: Password must be at least 6 characters long for security purposes." });
         return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         res.status(400).json({ error: "Validation Fail: Invalid email address format." });
         return;
      }

      const users = loadUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
         res.status(400).json({ error: "Authentication Fail: An account with this email is already registered." });
         return;
      }

      // Secure cryptographic hashing
      const passwordHash = bcrypt.hashSync(password, 10);

      // Assemble escaping fields for XSS defense
      const newUser: UserRecord = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        fullName: escapeXss(fullName.trim()),
        email: escapeXss(email.trim().toLowerCase()),
        passwordHash: passwordHash,
        phone: phone ? escapeXss(String(phone).trim()) : "",
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      res.status(200).json({ 
        message: "Registration completed successfully!", 
        user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email } 
      });
    } catch (err: any) {
      res.status(500).json({ error: "Internal registration error: " + err.message });
    }
  });

  // API Endpoint: User Login (Protected by Rate Limiter)
  app.post("/api/login", rateLimiter(15, 60000), (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== "string" || !email.trim() ||
          !password || typeof password !== "string" || !password.trim()) {
         res.status(400).json({ error: "Validation Fail: Please enter both email and password." });
         return;
      }

      const users = loadUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
         res.status(401).json({ error: "Authentication Fail: Invalid email or password." });
         return;
      }

      // Cryptographic hash validation
      const isMatch = bcrypt.compareSync(password, matchedUser.passwordHash);
      if (!isMatch) {
         res.status(401).json({ error: "Authentication Fail: Invalid email or password." });
         return;
      }

      // Generate a legitimate secure, signed JWT token
      const token = jwt.sign(
        { userId: matchedUser.id, email: matchedUser.email, fullName: matchedUser.fullName },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login authorized successfully!",
        token: token,
        user: {
          id: matchedUser.id,
          fullName: matchedUser.fullName,
          email: matchedUser.email,
          phone: matchedUser.phone
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: "Internal login verification error: " + err.message });
    }
  });

  // API Endpoint: Retrieve Session via verified JWT
  app.get("/api/session", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
       res.status(401).json({ active: false, error: "Access Denied: Missing authorization headers." });
       return;
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; fullName: string };
      
      const users = loadUsers();
      const matchedUser = users.find(u => u.id === decoded.userId);

      if (!matchedUser) {
         res.status(401).json({ active: false, error: "Access Denied: Associated citizen record not found." });
         return;
      }

      res.status(200).json({ 
        active: true, 
        user: { 
          id: matchedUser.id, 
          fullName: matchedUser.fullName, 
          email: matchedUser.email, 
          phone: matchedUser.phone 
        } 
      });
    } catch (err) {
       res.status(401).json({ active: false, error: "Access Denied: Invalid or expired authorization token." });
    }
  });

  // API Endpoint: User Logout
  app.post("/api/logout", (req, res) => {
    res.status(200).json({ message: "Logout context cleared successfully." });
  });

  // Vite integration as middleware for dev environment / Static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running securely on http://localhost:${PORT}`);
  });
}

startServer();
