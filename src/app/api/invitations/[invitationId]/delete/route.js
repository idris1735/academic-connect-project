import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// DELETE /api/invitations/[invitationId] - Delete invitation
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { invitationId } = params;
    const userId = session.user.id;

    const invitationRef = db.collection('invitations').doc(invitationId);
    const invitationDoc = await invitationRef.get();

    if (!invitationDoc.exists) {
      return NextResponse.json({
        message: 'Invitation not found',
      }, { status: 404 });
    }

    if (invitationDoc.data().senderId !== userId) {
      return NextResponse.json({
        message: 'Not authorized to delete this invitation',
      }, { status: 403 });
    }

    await invitationRef.delete();

    return NextResponse.json({
      message: 'Invitation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({
      message: 'Failed to delete invitation',
      error: error.message
    }, { status: 500 });
  }
} 