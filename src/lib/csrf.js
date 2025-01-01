import { validateToken } from 'next-csrf'

export async function validateCSRF(req) {
  const token = req.cookies['csrf-token']
  const headerToken = req.headers['x-csrf-token']

  if (!token || !headerToken || token !== headerToken) {
    throw new Error('Invalid CSRF token')
  }

  try {
    await validateToken(token, process.env.CSRF_SECRET)
    return true
  } catch (error) {
    throw new Error('Invalid CSRF token')
  }
}
