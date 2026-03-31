import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const courses = await sql`SELECT * FROM courses WHERE id = ${id}`;
    if (courses.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[0];
    const modules = await sql`SELECT * FROM modules WHERE course_id = ${id} ORDER BY order_index ASC`;

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await sql`SELECT * FROM lessons WHERE module_id = ${mod.id} ORDER BY order_index ASC`;
        return { ...mod, lessons };
      })
    );

    return NextResponse.json({ ...course, modules: modulesWithLessons });
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
