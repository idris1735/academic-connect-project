import { db } from '@/lib/firebase/config'
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'

class SignupService {
  async createUserProfile(userData, userType, subOption = null) {
    try {
      const batch = writeBatch(db)
      const uid = userData.uid
      const timestamp = serverTimestamp()

      // User profile document
      const userRef = doc(db, 'users', uid)
      batch.set(userRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        userType: userType,
        subOption: subOption,
        photoURL: userData.photoURL || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      })

      // Compute display name and full name
      const displayName = `${userData.firstName} ${userData.lastName}`.trim()

      // 1. Create user document in users collection
      const userRef2 = doc(db, 'users', uid)
      batch.set(userRef2, {
        uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName,
        userType,
        subOption,
        createdAt: timestamp,
        lastLogin: timestamp,
        isActive: true,
        gender: userData.gender || 'prefer_not_to_say',
        dateOfBirth: userData.dateOfBirth || null,
        phoneNumber: userData.phoneNumber || '',
        settings: {
          emailNotifications: true,
          pushNotifications: true,
          language: 'en',
          theme: 'light',
        },
      })

      // 2. Create user type document
      const userTypeRef = doc(db, 'userTypes', uid)
      batch.set(userTypeRef, {
        uid,
        type: userType,
        subOption,
        verificationStatus: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      })

      // 3. Create profile document with extended fields
      const profileRef = doc(db, 'profiles', uid)
      batch.set(profileRef, {
        uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName,
        userType,
        subOption,
        memberSince: timestamp,
        verified: false,
        photoURL: userData.photoURL || null,
        coverPhotoURL: '',
        occupation: userData.occupation || 'Not specified',
        researchInterests: userData.researchInterests || '',
        bio: '',
        location: '',
        website: '',
        socialLinks: {
          twitter: '',
          linkedin: '',
          github: '',
          orcid: '',
          googleScholar: '',
        },
        education: [],
        experience: [],
        skills: userData.skills || [],
        languages: [],
        stats: {
          posts: 0,
          publications: 0,
          citations: 0,
          connections: 0,
          followers: 0,
          following: 0,
          views: 0,
          reputation: 0,
        },
        preferences: {
          visibility: 'public',
          emailVisibility: 'connections',
          connectionRequests: 'everyone',
        },
      })

      // 4. Initialize notifications
      const notificationRef = doc(db, 'notifications', uid)
      batch.set(notificationRef, {
        uid,
        unreadCount: 0,
        lastChecked: timestamp,
      })

      await batch.commit()
      return { success: true, uid }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
      throw error
    }
  }

  async addRoleSpecificFields(baseProfile, userData, userType, subOption) {
    switch (userType) {
      case 'individual':
        return {
          ...baseProfile,
          institution: userData.institution || 'Not specified',
          department: userData.department || 'Not specified',
          researchInterests: userData.researchInterests || [],
          academicStatus: userData.academicStatus || 'Independent Researcher',
          orcidId: userData.orcidId || null,
        }

      case 'institution':
        if (subOption === 'Admin') {
          return {
            ...baseProfile,
            institution: userData.institution,
            adminRole: true,
            adminPhone: userData.adminPhone,
            department: 'Administration',
            institutionVerified: false,
          }
        } else {
          return {
            ...baseProfile,
            institution: userData.institution,
            department: userData.department,
            staffId: userData.staffId,
            position: userData.position,
            institutionVerified: false,
            facultyPage: userData.facultyPage || '',
          }
        }

      case 'corporate':
        if (subOption === 'Admin') {
          return {
            ...baseProfile,
            company: userData.company,
            adminRole: true,
            adminPhone: userData.adminPhone,
            department: 'Administration',
            companyVerified: false,
          }
        } else {
          return {
            ...baseProfile,
            company: userData.company,
            department: userData.department,
            employeeId: userData.employeeId,
            position: userData.position,
            companyVerified: false,
          }
        }

      default:
        return baseProfile
    }
  }

  async handleInstitutionSignup(batch, userData, subOption) {
    const { uid, institution, department, position, staffId, adminPhone } =
      userData
    const timestamp = serverTimestamp()

    if (subOption === 'Admin') {
      const institutionRef = doc(collection(db, 'institutions'))
      batch.set(institutionRef, {
        name: institution,
        adminUid: uid,
        emailDomain: userData.email.split('@')[1],
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        verificationStatus: 'pending',
        adminInfo: {
          email: userData.email,
          name: userData.name,
          phone: adminPhone,
        },
        departments: [],
        staff: [],
        settings: {
          allowStaffSignup: true,
          requireStaffVerification: true,
          allowPublicProfile: true,
        },
      })
    } else if (subOption === 'Staff') {
      const staffRef = doc(
        collection(db, 'institutions', institution, 'staff'),
        uid
      )

      batch.set(staffRef, {
        uid,
        staffId,
        department,
        position,
        dateJoined: timestamp,
        verificationStatus: 'pending',
        permissions: {
          canCreateResearchRooms: true,
          canInviteMembers: true,
          canPublish: true,
        },
      })
    }
  }

  async handleCorporateSignup(batch, userData, subOption) {
    const { uid, company, department, position, employeeId } = userData
    const timestamp = serverTimestamp()

    if (subOption === 'Admin') {
      const corporateRef = doc(collection(db, 'corporations'))
      batch.set(corporateRef, {
        name: company,
        adminUid: uid,
        emailDomain: userData.email.split('@')[1],
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        verificationStatus: 'pending',
        adminInfo: {
          email: userData.email,
          name: userData.name,
          phone: userData.adminPhone,
        },
        departments: [],
        employees: [],
        settings: {
          allowEmployeeSignup: true,
          requireEmployeeVerification: true,
          allowPublicProfile: true,
        },
      })
    } else if (subOption === 'Employee') {
      const employeeRef = doc(
        collection(db, 'corporations', company, 'employees'),
        uid
      )

      batch.set(employeeRef, {
        uid,
        employeeId,
        department,
        position,
        dateJoined: timestamp,
        verificationStatus: 'pending',
        permissions: {
          canCreateResearchRooms: true,
          canInviteMembers: true,
          canPublish: true,
        },
      })
    }
  }

  async handleIndividualSignup(batch, userData) {
    const { uid } = userData
    const timestamp = serverTimestamp()

    // Initialize publications collection
    const publicationsRef = doc(collection(db, 'publications'), uid)
    batch.set(publicationsRef, {
      publications: [],
      citations: 0,
      lastUpdated: timestamp,
    })

    // Initialize research interests
    const interestsRef = doc(collection(db, 'researchInterests'), uid)
    batch.set(interestsRef, {
      interests: userData.researchInterests || [],
      skills: userData.skills || [],
      updatedAt: timestamp,
    })
  }
}

export const signupService = new SignupService()
