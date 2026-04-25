import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email va parol kiritilishi shart' }, { status: 400 });
    }

    const result = await loginUser(email, password);
    return NextResponse.json(result, { status: result.success ? 200 : 401 });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
