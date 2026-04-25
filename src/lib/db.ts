import { neon } from '@neondatabase/serverless';

const dbUrl = process.env.DATABASE_URL;
export const sql: any = dbUrl ? neon(dbUrl) : async (...args: any[]) => ([]);

export async function createTables() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Courses table
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        subtitle TEXT,
        category_id TEXT,
        description TEXT,
        image_url TEXT,
        price DECIMAL(10, 2) DEFAULT 0.00,
        is_free BOOLEAN DEFAULT TRUE,
        published BOOLEAN DEFAULT FALSE,
        owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Modules table
    await sql`
      CREATE TABLE IF NOT EXISTS modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `;

    // Lessons table
    await sql`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        video_url TEXT,
        content TEXT,
        attachments JSONB DEFAULT '[]',
        is_free BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0
      );
    `;

    // Enrollments table
    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      );
    `;

    // Lesson Progress table
    await sql`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE,
        UNIQUE(user_id, lesson_id)
      );
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
}
