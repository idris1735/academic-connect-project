// Rate limiting middleware
import rateLimit from 'express-rate-limit'
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
})

// Verify organization access code
export async function verifyOrganizationCode(code, orgType) {
  try {
    const isValid = await redis.get(`org:${code}`)
    if (!isValid) {
      throw new Error('Invalid organization code')
    }
    return JSON.parse(isValid)
  } catch (error) {
    throw new Error('Failed to verify organization code')
  }
}
