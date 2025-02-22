const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');

export async function GET() {
  try {
    const cookieStore = cookies();
    
    // Clear all session cookies
    cookieStore.delete('session');
    cookieStore.delete('chatToken');

    return NextResponse.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed', details: error.message }, 
      { status: 500 }
    );
  }
}; 