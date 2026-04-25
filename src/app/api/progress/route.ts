import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCurrentUser } from '@/lib/auth';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl ? neon(dbUrl) : async (...args: any[]) => ([]);

export const dynamic = 'force-dynamic';

// GET progress for a course
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ completed: [], percentage: 0 });
    }

    const courseId = request.nextUrl.searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 });
    }

    if (!dbUrl) {
      return NextResponse.json({ completed: [], percentage: 0 });
    }

    const progress = await sql`
      SELECT lp.lesson_id, lp.completed, lp.completed_at 
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      JOIN modules m ON m.id = l.module_id
      WHERE lp.user_id = ${user.id} AND m.course_id = ${courseId} AND lp.completed = true
    `;

    const totalLessons = await sql`
      SELECT COUNT(*) as count FROM lessons l 
      JOIN modules m ON m.id = l.module_id 
      WHERE m.course_id = ${courseId}
    `;

    const total = parseInt(totalLessons[0]?.count || '0');
    const completedCount = progress.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return NextResponse.json({
      completed: progress.map((p: any) => p.lesson_id),
      percentage,
      completedCount,
      totalLessons: total,
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ completed: [], percentage: 0 });
  }
}

// POST - toggle lesson completion
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avval tizimga kiring' }, { status: 401 });
    }

    const { lessonId, completed } = await request.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
    }

    if (!dbUrl) {
      return NextResponse.json({ success: true });
    }

    if (completed) {
      await sql`
        INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
        VALUES (${user.id}, ${lessonId}, true, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP
      `;
    } else {
      await sql`
        DELETE FROM lesson_progress WHERE user_id = ${user.id} AND lesson_id = ${lessonId}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
