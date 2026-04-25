import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export async function POST(request: NextRequest) {
  try {
    const { moduleId, title, videoUrl, content, isFree, attachments } = await request.json();
    if (!moduleId || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    if (!sql) {
      const newLesson = localSql.insert('lessons', { 
        module_id: moduleId, 
        title, 
        video_url: videoUrl,
        content: content || "",
        is_free: isFree || false,
        attachments: attachments || [],
        order_index: localSql.select('lessons', l => l.module_id === moduleId).length 
      });
      return NextResponse.json(newLesson);
    }

    const [newLesson] = await sql`
      INSERT INTO lessons (module_id, title, video_url, content, is_free, attachments, order_index) 
      VALUES (${moduleId}, ${title}, ${videoUrl}, ${content || ''}, ${isFree || false}, ${JSON.stringify(attachments || [])}, (SELECT COALESCE(MAX(order_index), -1) + 1 FROM lessons WHERE module_id = ${moduleId})) 
      RETURNING *
    `;
    return NextResponse.json(newLesson);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { lessonId } = await request.json();
    if (!sql) {
      const db = require('@/lib/local-db').readDb();
      db.lessons = db.lessons.filter((l: any) => l.id !== lessonId);
      require('@/lib/local-db').writeDb(db);
      return NextResponse.json({ success: true });
    }
    await sql`DELETE FROM lessons WHERE id = ${lessonId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
