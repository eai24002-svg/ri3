import { z } from 'zod'
import { createAdminSessionToken } from '~/server/utils/admin-session'

const bodySchema = z.object({
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = bodySchema.parse(await readBody(event))

  if (!config.adminPassword || body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'كلمة المرور غير صحيحة' })
  }

  setCookie(event, 'admin_session', createAdminSessionToken(config.adminPassword), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  })

  setCookie(event, 'admin_logged_in', '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  })

  return { ok: true }
})
