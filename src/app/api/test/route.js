import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export async function GET(req) {
  try {
    return NextResponse.json({ 
      message: 'API is working!' 
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 