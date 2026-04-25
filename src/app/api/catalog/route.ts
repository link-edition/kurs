import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export async function GET() {
  try {
    if (!sql) {
      // Local Database Logic
      const courses = localSql.select('courses', (c) => c.published === true);
      const coursesWithCounts = courses.map((c: any) => {
        const modules = localSql.select('modules', (m) => m.course_id === c.id);
        const lessons = localSql.select('lessons', (l) => modules.some(m => m.id === l.module_id));
        return {
          ...c,
          modules_count: modules.length,
          lessons_count: lessons.length
        };
      });
      return NextResponse.json(coursesWithCounts);
    }

    // Cloud Database Logic
    const courses = await sql`
      SELECT id, title, subtitle, description, price, is_free, image_url, created_at,
      (SELECT COUNT(*) FROM modules WHERE course_id = courses.id) as modules_count,
      (SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = courses.id) as lessons_count
      FROM courses
      WHERE published = TRUE
      ORDER BY created_at DESC
    `;
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to list courses:', error);
    return NextResponse.json([]);
  }
}
