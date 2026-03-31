import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Add a new module
export async function POST(request: NextRequest) {
  try {
    const { courseId, title } = await request.json();
    if (!courseId || !title) {
      return NextResponse.json({ error: 'courseId and title required' }, { status: 400 });
    }

    const orderResult = await sql`SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM modules WHERE course_id = ${courseId}`;
    const nextOrder = orderResult[0].next_order;

    const result = await sql`
      INSERT INTO modules (course_id, title, order_index)
      VALUES (${courseId}, ${title}, ${nextOrder})
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to add module:', error);
    return NextResponse.json({ error: 'Failed to add module' }, { status: 500 });
  }
}

// Delete a module
export async function DELETE(request: NextRequest) {
  try {
    const { moduleId } = await request.json();
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId required' }, { status: 400 });
    }

    await sql`DELETE FROM lessons WHERE module_id = ${moduleId}`;
    await sql`DELETE FROM modules WHERE id = ${moduleId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete module:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
