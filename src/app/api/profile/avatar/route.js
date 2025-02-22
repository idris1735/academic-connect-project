const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { auth } = require('@/lib/auth');
const { handleError } = require('@/lib/error-utils');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs/promises');

export const runtime = 'nodejs';
// POST /api/profile/avatar - Update profile avatar
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const attachment = formData.get('avatar');

    if (!attachment) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }


    const userId = session.user.id;
    const buffer = Buffer.from(await attachment.arrayBuffer());
    const fileExtension = path.extname(attachment.name);
    const fileName = `${userId}_${Date.now()}${fileExtension}`;
    
    // Store in the Next.js public directory
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'images', 'avatars', fileName);
    const publicUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);


    // Ensure directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // Write file
    await fs.writeFile(uploadPath, buffer);
    // Update profile with new avatar URL
    const profileRef = db.collection('profiles').doc(userId);
    await profileRef.update({
      photoURL: publicUrl,  // Store the public URL path
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Avatar uploaded:', publicUrl);

    return NextResponse.json({
      message: 'Avatar updated successfully',
      photoURL: publicUrl
    });

  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: error.message });
  }
}; 


