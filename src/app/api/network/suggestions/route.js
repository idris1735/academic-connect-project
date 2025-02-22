const { NextResponse } = require('next/server');
const { admin } = require('@/lib/firebase-admin');
const { handleError } = require('@/lib/error-utils');

export const runtime = 'nodejs';
// GET /api/network/suggestions - Get people you may know
exports.GET = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userID = session.user.id;
    const userProfileRef = admin.db.collection('profiles').doc(userID);
    const userProfile = await userProfileRef.get();

    if (!userProfile.exists) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    const userData = userProfile.data();
    const userConnections = new Set(userData?.connections?.connected || []);
    const userInstitution = userData.institution;
    const userResearchInterests = new Set(userData.researchInterests || []);

    // Get all connections of connections (2nd degree connections)
    const secondDegreeConnections = new Map();

    // Get profiles of all direct connections
    const connectionProfiles = await Promise.all(
      [...userConnections].map(connId => 
        admin.db.collection('profiles').doc(connId).get()
      )
    );

    // Process each connection's connections
    for (const connProfile of connectionProfiles) {
      if (!connProfile.exists) continue;
      
      const connData = connProfile.data();
      const theirConnections = connData?.connections?.connected || [];
      
      for (const potentialConnection of theirConnections) {
        if (potentialConnection === userID || userConnections.has(potentialConnection)) {
          continue;
        }
        
        secondDegreeConnections.set(
          potentialConnection, 
          {
            mutualCount: (secondDegreeConnections.get(potentialConnection)?.mutualCount || 0) + 1,
            userId: potentialConnection
          }
        );
      }
    }

    // Get full profiles and calculate relevance scores
    const suggestionsWithScores = await Promise.all(
      [...secondDegreeConnections.values()].map(async ({ userId, mutualCount }) => {
        const profileDoc = await admin.db.collection('profiles').doc(userId).get();
        const profileData = profileDoc.data();

        let relevanceScore = mutualCount;

        if (profileData.institution === userInstitution) {
          relevanceScore += 0.5;
        }

        const theirInterests = new Set(profileData.researchInterests || []);
        const commonInterests = [...userResearchInterests].filter(interest => 
          theirInterests.has(interest)
        );
        relevanceScore += commonInterests.length * 0.3;

        return {
          id: userId,
          userId: userId,
          name: profileData.displayName,
          role: profileData.role,
          university: profileData.institution,
          avatar: profileData.photoURL,
          mutualConnections: mutualCount,
          researchInterests: profileData.researchInterests || [],
          commonInterests: commonInterests,
          connectionStatus: 'none',
          relevanceScore
        };
      })
    );

    // Sort by relevance score and take top 10
    const suggestions = suggestionsWithScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 