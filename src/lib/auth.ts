import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

// Simple token = base64(userId:timestamp:secret)
const AUTH_SECRET = process.env.AUTH_SECRET || 'course-architect-secret-key-2026';
const COOKIE_NAME = 'ca_session';

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar_url: string | null;
};

// Simple hash function (for demo - in production use bcrypt)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const base = Math.abs(hash).toString(36);
  return `sh_${base}_${str.length}_${str.charCodeAt(0)}`;
}

function createToken(userId: string): string {
  const payload = `${userId}:${Date.now()}:${AUTH_SECRET}`;
  return Buffer.from(payload).toString('base64url');
}

function decodeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3 || parts[2] !== AUTH_SECRET) return null;
    return parts[0]; // userId
  } catch {
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string, role: any = 'student'): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  try {
    const emailLower = email.toLowerCase();
    const passwordHash = simpleHash(password);

    if (!sql) {
      const existing = localSql.select('users', (u) => u.email === emailLower);
      if (existing.length > 0) return { success: false, error: 'Bu email allaqachon mavjud' };

      const user = localSql.insert('users', { name, email: emailLower, password_hash: passwordHash, role, avatar_url: null });
      const token = createToken(user.id);
      
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' });
      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url } };
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${emailLower}`;
    if (existing.length > 0) return { success: false, error: 'Bu email allaqachon mavjud' };

    const [user] = await sql`INSERT INTO users (name, email, password_hash, role) VALUES (${name}, ${emailLower}, ${passwordHash}, ${role}) RETURNING id, name, email, role, avatar_url`;
    const token = createToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Xatolik yuz berdi' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  try {
    const emailLower = email.toLowerCase();
    const passwordHash = simpleHash(password);

    if (!sql) {
      const users = localSql.select('users', (u) => u.email === emailLower);
      if (users.length === 0 || users[0].password_hash !== passwordHash) {
        return { success: false, error: 'Email yoki parol noto\'g\'ri' };
      }
      const user = users[0];
      const token = createToken(user.id);
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' });
      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url } };
    }

    const result = await sql`SELECT * FROM users WHERE email = ${emailLower}`;
    if (result.length === 0 || result[0].password_hash !== passwordHash) {
      return { success: false, error: 'Email yoki parol noto\'g\'ri' };
    }
    const user = result[0];
    const token = createToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60, path: '/' });
    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url } };
  } catch (error) {
    return { success: false, error: 'Xatolik yuz berdi' };
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const userId = decodeToken(token);
    if (!userId) return null;

    if (!sql) {
      const users = localSql.select('users', (u) => u.id === userId);
      if (users.length === 0) return null;
      return { id: users[0].id, name: users[0].name, email: users[0].email, role: users[0].role, avatar_url: users[0].avatar_url };
    }

    const result = await sql`SELECT id, name, email, role, avatar_url FROM users WHERE id = ${userId}`;
    if (result.length === 0) return null;
    return result[0];
  } catch {
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
