import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const dynamic = 'force-dynamic';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { title, thumbnail, price, is_free } = body;

    // Use a clean update strategy
    const result = await sql`
      UPDATE courses 
      SET 
        title = ${title !== undefined ? title : sql`title`},
        thumbnail = ${thumbnail !== undefined ? thumbnail : sql`thumbnail`},
        price = ${price !== undefined ? price : sql`price`},
        is_free = ${is_free !== undefined ? is_free : sql`is_free`}
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
