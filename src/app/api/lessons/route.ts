import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const dynamic = 'force-dynamic';

// Add a new lesson
export async function POST(request: NextRequest) {
  try {
    const { moduleId, title, videoUrl, content } = await request.json();
    if (!moduleId || !title) {
      return NextResponse.json({ error: 'moduleId and title required' }, { status: 400 });
    }

    const orderResult = await sql`SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM lessons WHERE module_id = ${moduleId}`;
    const nextOrder = orderResult[0].next_order;

    const result = await sql`
      INSERT INTO lessons (module_id, title, video_url, content, order_index, is_free)
      VALUES (${moduleId}, ${title}, ${videoUrl || null}, ${content || null}, ${nextOrder}, false)
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to add lesson:', error);
    return NextResponse.json({ error: 'Failed to add lesson' }, { status: 500 });
  }
}

// Update a lesson
export async function PUT(request: NextRequest) {
  try {
    const { lessonId, title, videoUrl, content } = await request.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE lessons 
      SET title = COALESCE(${title}, title),
          video_url = COALESCE(${videoUrl}, video_url),
          content = COALESCE(${content}, content)
      WHERE id = ${lessonId}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update lesson:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

// Delete a lesson
export async function DELETE(request: NextRequest) {
  try {
    const { lessonId } = await request.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
    }

    await sql`DELETE FROM lessons WHERE id = ${lessonId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
