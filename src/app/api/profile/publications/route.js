import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { handleError } from '@/lib/error-utils';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
// GET /api/profile/publications - Get user publications
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('uid') || session.user.id;

    if (!userId) {
      return NextResponse.json({ message: 'User ID not found' }, { status: 400 });
    }

    const publicationsRef = db.collection('publications').where('userId', '==', userId);
    const snapshot = await publicationsRef.get();

    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const publications = await Promise.all(snapshot.docs.map(async (doc) => {
      const pub = doc.data();
      pub.uploadDate = pub.uploadDate.toDate().toISOString();
      return { id: doc.id, ...pub };
    }));

    // Filter public publications if requesting other user's publications
    if (userId !== session.user.id) {
      publications = publications.filter(doc => doc.isPublic === true);
    }

    return NextResponse.json(publications);

  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// POST /api/profile/publications - Add new publication
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await req.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName');
    const fileSize = formData.get('fileSize');
    const fileType = formData.get('fileType');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }


    // const buffer = Buffer.from(await file.arrayBuffer());
    // const fileExtension = path.extname(file.name);
    // const fileName = `${userId}_${uuidv4()}${fileExtension}`;
    // const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'publications', fileName);

    // // Ensure directory exists
    // await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // // Write file
    // await fs.writeFile(uploadPath, buffer);

    // // Get relative URL for storage in database
    // const publicationUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);

    // // Create publication document
    // const pub_ref = db.collection('publications').doc();
    // const pub = {
    //   id: pub_ref.id,
    //   title: file.name.replace(fileExtension, ''),
    //   fileName,
    //   publicationUrl,
    //   fileSize: file.size,
    //   fileType: fileExtension.replace('.', ''),
    //   isPublic: false,
    //   uploadDate: admin.firestore.FieldValue.serverTimestamp(),
    //   userId: userId
    // };

    // await pub_ref.set(pub);

    const bufferFile = await file.arrayBuffer();
    const buffer = Buffer.from(bufferFile);
    const fileExtension = path.extname(file.name);
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'publications', `${userId}_${uuidv4()}${fileExtension}`);
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.writeFile(uploadPath, buffer);
    const publicationUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);
    
    
    const pub_ref = db.collection('publications').doc();
    const pub_id = pub_ref.id;
    const pub = {
      id: pub_id,
      fileName,
      publicationUrl,
      fileSize,
      fileType: fileExtension.replace('.', ''),
      isPublic: false,
      uploadDate: admin.firestore.FieldValue.serverTimestamp(),
      userId: userId
    }

   
    await pub_ref.set(pub);

    return NextResponse.json({ 
      message: 'Publication added', 
      pub 
    });

  } catch (error) {
    console.error('Error adding publication:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 

// PUT /api/profile/publications/action - Update publication visibility
export async function PUT(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the URL from the request
    const { searchParams } = new URL(req.url);
    
    // Get the action parameter
    const action = searchParams.get('action');
    const body = await req.json();
    const { publicationId } = body;
    console.log('publicationId', publicationId);

    if (action === 'edit') {
      let { publicationName, fileType } = body;
      // Update the publication name
      try{
        // get publication file type
        if (fileType && !publicationName.includes(fileType)) {
          // Remove the file type from the publication name
          publicationName = publicationName.replace(`.${fileType}`, '');
        }
        await db.collection('publications').doc(publicationId).update({
          fileName: publicationName
        });
        return NextResponse.json({ message: 'Publication name updated' });
      } catch (error) {
        console.error('Error updating publication name:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (action === 'visibility') {
      try{
        await db.collection('publications').doc(publicationId).update({
          isPublic: body.isPublic
        });
        return NextResponse.json({ message: 'Publication visibility updated' });
      } catch (error) {
        console.error('Error updating publication visibility:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error('Error updating publication visibility:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}

// DELETE /api/profile/publications - Delete publication
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { publicationUrl, publicationId, publicationName } = body;
     // Delete from local storage
     const uploadPath = path.join(process.cwd(), 'public', publicationUrl);
     const publicationRef = db.collection('publications').doc(publicationId);
     await fs.unlink(uploadPath);
     await publicationRef.delete();


    return NextResponse.json({ message: 'Publication deleted' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}