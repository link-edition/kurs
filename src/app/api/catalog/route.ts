import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const courses = await sql`
      SELECT id, title, subtitle, description, price, is_free, image_url, created_at,
      (SELECT COUNT(*) FROM modules WHERE course_id = courses.id) as modules_count,
      (SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = courses.id) as lessons_count
      FROM courses
      ORDER BY created_at DESC
    `;
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to list courses:', error);
    return NextResponse.json([], { status: 500 });
  }
}
