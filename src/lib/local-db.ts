import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Fayl saqlanadigan joy: loyiha ildizidagi /data/db.json
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Papka va fayl mavjudligini tekshirish
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    users: [],
    courses: [],
    modules: [],
    lessons: [],
    enrollments: [],
    lesson_progress: [],
    settings: {
      id: 'global',
      academy_name: 'Course Architect',
      currency: 'USD',
      primary_color: '#cafd00',
      language: 'uz'
    }
  }, null, 2));
}

export function readDb() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

export function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export const localSql = {
  select: (table: string, filter?: (item: any) => boolean) => {
    const db = readDb();
    const items = db[table] || [];
    return filter ? items.filter(filter) : items;
  },
  insert: (table: string, item: any) => {
    const db = readDb();
    if (!db[table]) db[table] = [];
    const newItem = { 
      id: randomUUID(), 
      created_at: new Date().toISOString(), 
      ...item 
    };
    db[table].push(newItem);
    writeDb(db);
    return newItem;
  },
  update: (table: string, id: string, updates: any) => {
    const db = readDb();
    const index = db[table].findIndex((i: any) => i.id === id);
    if (index !== -1) {
      db[table][index] = { ...db[table][index], ...updates, updated_at: new Date().toISOString() };
      writeDb(db);
      return db[table][index];
    }
    return null;
  }
};
