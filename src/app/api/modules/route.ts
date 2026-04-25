import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export async function POST(request: NextRequest) {
  try {
    const { courseId, title } = await request.json();
    if (!courseId || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    if (!sql) {
      const db = localSql.select('courses', c => c.id === courseId);
      if (db.length === 0) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      
      const newModule = localSql.insert('modules', { 
        course_id: courseId, 
        title, 
        order_index: localSql.select('modules', m => m.course_id === courseId).length 
      });
      return NextResponse.json(newModule);
    }

    const [newModule] = await sql`INSERT INTO modules (course_id, title, order_index) VALUES (${courseId}, ${title}, (SELECT COALESCE(MAX(order_index), -1) + 1 FROM modules WHERE course_id = ${courseId})) RETURNING *`;
    return NextResponse.json(newModule);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { moduleId } = await request.json();
    if (!sql) {
      // Local DB delete logic (simplified)
      const db = require('@/lib/local-db').readDb();
      db.modules = db.modules.filter((m: any) => m.id !== moduleId);
      db.lessons = db.lessons.filter((l: any) => l.module_id !== moduleId);
      require('@/lib/local-db').writeDb(db);
      return NextResponse.json({ success: true });
    }
    await sql`DELETE FROM modules WHERE id = ${moduleId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
