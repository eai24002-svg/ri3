import { createHmac } from 'node:crypto'

export const createAdminSessionToken = (adminPassword: string) =>
  createHmac('sha256', adminPassword)
    .update('admin-session')
    .digest('hex')

