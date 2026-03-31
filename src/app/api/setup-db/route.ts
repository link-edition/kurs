import { createTables } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ message: 'Success: Tables created in Neon SQL' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create tables' }, { status: 500 });
  }
}
