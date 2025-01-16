// Demo access codes - In production, this would be in a secure database
const DEMO_ACCESS_CODES = {
  university: {
    admin: {
      codes: [
        { code: 'INST-ADMIN-2024', institution: '*' }, // Update this to match exactly
        { code: 'UNILAG-ADMIN-24', institution: 'UNILAG' },
        { code: 'UI-ADMIN-24', institution: 'UI' },
      ],
      expiresIn: '24h',
    },
    staff: {
      codes: [
        { code: 'INST-STAFF-2024', institution: '*' },
        { code: 'UNILAG-STAFF-24', institution: 'UNILAG' },
        { code: 'UI-STAFF-24', institution: 'UI' },
      ],
      expiresIn: '24h',
    },
  },
  corporate: {
    admin: {
      codes: [
        { code: 'CORP-ADMIN-2024', organization: '*' },
        { code: 'NNPC-ADMIN-24', organization: 'NNPC' },
      ],
      expiresIn: '24h',
    },
    employee: {
      codes: [
        { code: 'CORP-EMP-2024', organization: '*' },
        { code: 'NNPC-EMP-24', organization: 'NNPC' },
      ],
      expiresIn: '24h',
    },
  },
  polytechnic: {
    admin: {
      codes: [
        { code: 'POLY-ADMIN-2024', institution: '*' },
        { code: 'FEDPA-ADMIN-24', institution: 'FEDPA' },
        { code: 'YABATECH-ADMIN-24', institution: 'YABATECH' },
      ],
      expiresIn: '24h',
    },
    staff: {
      codes: [
        { code: 'POLY-STAFF-2024', institution: '*' },
        { code: 'FEDPA-STAFF-24', institution: 'FEDPA' },
      ],
      expiresIn: '24h',
    },
    department: {
      codes: [
        // Department-specific codes
        { code: 'FEDPA-CE-24', institution: 'FEDPA', department: 'CE' },
        { code: 'FEDPA-EEE-24', institution: 'FEDPA', department: 'EEE' },
        { code: 'FEDPA-ME-24', institution: 'FEDPA', department: 'ME' },
        { code: 'FEDPA-CS-24', institution: 'FEDPA', department: 'CS' },
        { code: 'FEDPA-BA-24', institution: 'FEDPA', department: 'BA' },
      ],
      expiresIn: '24h',
    },
  },
  college_of_education: {
    admin: {
      codes: [
        { code: 'COE-ADMIN-2024', institution: '*' },
        { code: 'FCEK-ADMIN-24', institution: 'FCEKANO' },
      ],
      expiresIn: '24h',
    },
    // Add staff and department codes
  },
  specialized_college: {
    admin: {
      codes: [
        { code: 'SPEC-ADMIN-2024', institution: '*' },
        { code: 'NCAT-ADMIN-24', institution: 'NCAT' },
      ],
      expiresIn: '24h',
    },
    // Add staff and department codes
  },
}

// Add helper function to generate institution-specific codes
export const generateInstitutionCode = (institution, type, role) => {
  const year = new Date().getFullYear().toString().slice(-2)
  const pattern = institutionTypes.find((t) => t.value === type)
    ?.accessCodePattern[role]

  if (!pattern) return null

  return pattern
    .replace('{UNI}', institution.abbreviation)
    .replace('{POLY}', institution.abbreviation)
    .replace('{COE}', institution.abbreviation)
    .replace('{SPEC}', institution.abbreviation)
    .replace('{YY}', year)
}

export const accessCodeService = {
  validateCode: async (code, type, subType, organizationId = '*') => {
    // Add debug logging
    console.log('Validating code:', {
      code,
      type,
      subType,
      organizationId,
    })

    // Map institution type to correct key if needed
    const mappedType = type === 'university' ? 'university' : type

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Get codes for this type and subType
      const validCodes = DEMO_ACCESS_CODES[mappedType]?.[subType]?.codes || []
      console.log('Valid codes:', validCodes)

      // Check if code exists and matches organization
      const matchingCode = validCodes.find(
        (c) =>
          c.code === code &&
          (c.institution === '*' || c.institution === organizationId)
      )
      console.log('Matching code:', matchingCode)

      if (matchingCode) {
        return {
          valid: true,
          message: 'Access code validated successfully',
          expiresIn: DEMO_ACCESS_CODES[mappedType][subType].expiresIn,
        }
      }

      return {
        valid: false,
        message: 'Invalid access code',
      }
    } catch (error) {
      console.error('Access code validation error:', error)
      return {
        valid: false,
        message: 'Error validating access code',
      }
    }
  },

  // Helper to get demo codes (for development only)
  getDemoCodes: (type, subType) => {
    if (process.env.NODE_ENV === 'development') {
      return DEMO_ACCESS_CODES[type]?.[subType]?.codes || []
    }
    return []
  },

  validateDepartmentCode: async (code, institutionId, departmentCode) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Check if code exists in demo codes first (for development)
      const deptCodes = DEMO_ACCESS_CODES.polytechnic.department.codes
      const matchingCode = deptCodes.find(
        (c) =>
          c.code === code &&
          c.institution === institutionId &&
          c.department === departmentCode
      )

      if (matchingCode) {
        return {
          valid: true,
          message: 'Department code validated successfully',
          expiresIn: DEMO_ACCESS_CODES.polytechnic.department.expiresIn,
        }
      }

      // If no matching demo code, validate against pattern
      const institution = nigerianInstitutions.find(
        (inst) => inst.abbreviation === institutionId
      )

      if (!institution)
        return {
          valid: false,
          message: 'Institution not found',
        }

      const department = institution.departments?.find(
        (dept) => dept.code === departmentCode
      )

      if (!department)
        return {
          valid: false,
          message: 'Department not found',
        }

      // Generate expected code pattern
      const year = new Date().getFullYear().toString().slice(-2)
      const expectedCode = `${institutionId}-${departmentCode}-${year}`

      return {
        valid: code === expectedCode,
        message:
          code === expectedCode
            ? 'Department code validated successfully'
            : 'Invalid department code',
        department: department.name,
      }
    } catch (error) {
      console.error('Department code validation error:', error)
      return {
        valid: false,
        message: 'Error validating department code',
      }
    }
  },

  // Helper to get department codes for an institution
  getDepartmentCodes: (institutionId) => {
    if (process.env.NODE_ENV === 'development') {
      return DEMO_ACCESS_CODES.polytechnic.department.codes.filter(
        (code) => code.institution === institutionId
      )
    }
    return []
  },

  validateProgramAccess: async (institutionId, departmentCode, programType) => {
    try {
      const institution = nigerianInstitutions.find(
        (inst) => inst.abbreviation === institutionId
      )

      if (!institution)
        return {
          valid: false,
          message: 'Institution not found',
        }

      const department = institution.departments.find(
        (dept) => dept.code === departmentCode
      )

      if (!department)
        return {
          valid: false,
          message: 'Department not found',
        }

      const program = department.programs.find(
        (prog) => prog.type === programType
      )

      return {
        valid: !!program,
        message: program
          ? 'Program access validated'
          : 'Program not found in department',
        programDetails: program,
      }
    } catch (error) {
      console.error('Program validation error:', error)
      return {
        valid: false,
        message: 'Error validating program access',
      }
    }
  },

  // Helper to get programs for a department
  getDepartmentPrograms: (institutionId, departmentCode) => {
    const institution = nigerianInstitutions.find(
      (inst) => inst.abbreviation === institutionId
    )
    const department = institution?.departments.find(
      (dept) => dept.code === departmentCode
    )
    return department?.programs || []
  },
}
