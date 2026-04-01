import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const dynamic = 'force-dynamic';

async function initSettings() {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'global',
      academy_name TEXT DEFAULT 'Course Architect',
      academy_logo TEXT,
      currency TEXT DEFAULT 'USD',
      primary_color TEXT DEFAULT '#cafd00',
      language TEXT DEFAULT 'uz',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await sql`
    INSERT INTO settings (id, academy_name)
    VALUES ('global', 'Course Architect')
    ON CONFLICT (id) DO NOTHING;
  `;
}

export async function GET() {
  try {
    await initSettings();
    const settings = await sql`SELECT * FROM settings WHERE id = 'global'`;
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { academy_name, academy_logo, currency, primary_color, language } = body;

    const result = await sql`
      UPDATE settings 
      SET academy_name = ${academy_name}, 
          academy_logo = ${academy_logo},
          currency = ${currency},
          primary_color = ${primary_color},
          language = ${language},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 'global'
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
