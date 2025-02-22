import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { handleError } from '@/lib/error-utils';
import { auth } from '@/lib/auth';
import { getRecentActivity } from '@/lib/utils/user';
export const runtime = 'nodejs';
// Helper function to format activity
function formatActivity(activity) {
  try {
    switch (activity.type) {
      case 'post':
        return {
          ...activity,
          description: `Created a new post in ${activity.category}`,
          link: `/posts/${activity.id}`
        };
      
      case 'comment':
        return {
          ...activity,
          description: `Commented: "${activity.content.substring(0, 50)}${activity.content.length > 50 ? '...' : ''}"`,
          link: `/posts/${activity.postId}`
        };
      
      case 'like':
        return {
          ...activity,
          description: 'Liked a post',
          link: `/posts/${activity.postId}`
        };
      
      default:
        return {
          ...activity,
          description: 'Unknown activity',
          link: '#'
        };
    }
  } catch (error) {
    console.error('Error formatting activity:', error);
    return {
      ...activity,
      description: 'Error formatting activity',
      link: '#'
    };
  }
}

// GET /api/profile/activities/[uid]
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { uid } = params;
    console.log(`Fetching recent activity for user: ${uid}`);
    
    const activities = await getRecentActivity(uid);
    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500, message: 'Failed to fetch activities', error: error.message });
  }
}; 