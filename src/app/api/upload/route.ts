import { NextRequest, NextResponse } from 'next/server';
import { saveFileLocally } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'thumbnail' or 'attachment'

    if (!file) {
      return NextResponse.json({ error: 'Fayl tanlanmagan' }, { status: 400 });
    }

    const folder = type === 'thumbnail' ? 'lesson-thumbnails' : type === 'video' ? 'videos' : 'attachments';
    const filePath = await saveFileLocally(file, folder);
    
    return NextResponse.json({ url: filePath });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Faylni yuklashda xatolik yuz berdi' }, { status: 500 });
  }
}
