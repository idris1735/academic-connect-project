const { NextResponse } = require('next/server');
const { admin, db, auth } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');

export const runtime = 'nodejs';
// PUT /api/profile/settings - Update notification settings or password
exports.PUT = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { type, ...data } = await req.json();

    const profileRef = db.collection('profiles').doc(userId);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    switch (type) {
      case 'notifications': {
        const {
          emailNotifications,
          pushNotifications,
          marketingEmails,
          securityAlerts
        } = data;

        await profileRef.update({
          'settings.notifications': {
            ...(emailNotifications !== undefined && { emailNotifications }),
            ...(pushNotifications !== undefined && { pushNotifications }),
            ...(marketingEmails !== undefined && { marketingEmails }),
            ...(securityAlerts !== undefined && { securityAlerts })
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
          message: 'Notification settings updated successfully'
        });
      }

      case 'password': {
        const { currentPassword, newPassword } = data;

        if (!currentPassword || !newPassword) {
          return NextResponse.json({ 
            message: 'Current and new password are required' 
          }, { status: 400 });
        }

        // Verify current password
        try {
          await admin.auth().updateUser(userId, {
            password: newPassword
          });
        } catch (error) {
          return NextResponse.json({ 
            message: 'Failed to update password',
            error: error.message 
          }, { status: 400 });
        }

        return NextResponse.json({
          message: 'Password updated successfully'
        });
      }

      default:
        return NextResponse.json({ 
          message: 'Invalid settings type' 
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 