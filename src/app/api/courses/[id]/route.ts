import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!sql) {
      const course = localSql.select('courses', (c) => c.id === id)[0];
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      
      const modules = localSql.select('modules', (m) => m.course_id === id);
      const modulesWithLessons = modules.map((mod: any) => {
        const lessons = localSql.select('lessons', (l) => l.module_id === mod.id);
        return { ...mod, lessons };
      });
      return NextResponse.json({ ...course, modules: modulesWithLessons });
    }

    const courses = await sql`SELECT * FROM courses WHERE id = ${id}`;
    if (courses.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[0];
    const modules = await sql`SELECT * FROM modules WHERE course_id = ${id} ORDER BY order_index ASC`;

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod: any) => {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, price, isFree } = body;

    if (!sql) {
      const updated = localSql.update('courses', id, {
        title, subtitle, image_url: imageUrl, price, is_free: isFree
      });
      if (!updated) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      return NextResponse.json(updated);
    }

    const result = await sql`
      UPDATE courses 
      SET title = ${title}, 
          subtitle = ${subtitle},
          image_url = ${imageUrl},
          price = ${price},
          is_free = ${isFree}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
