import {
  nigerianInstitutions,
  institutionTypes,
  getInstitutionsByType as getInstitutions,
} from '@/data/institutions'

// Generic helpers
export const getUniqueStates = () => {
  return [...new Set(nigerianInstitutions.map((inst) => inst.state))].sort()
}

// Institution helpers
export const getInstitutionTypes = () => institutionTypes

export const getInstitutionsByType = (type) => {
  return getInstitutions(type)
}

export const getInstitutionsByState = (state) => {
  return nigerianInstitutions.filter(
    (inst) => inst.state.toLowerCase() === state.toLowerCase()
  )
}

export const validateInstitutionalEmail = (email, institutionId) => {
  const institution = nigerianInstitutions.find(
    (inst) => inst.abbreviation === institutionId
  )
  if (!institution) return false
  return institution.domains?.some((domain) => email.endsWith(domain))
}
