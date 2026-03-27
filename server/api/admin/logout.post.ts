export default defineEventHandler(async (event) => {
  deleteCookie(event, 'admin_session', {
    path: '/'
  })
  deleteCookie(event, 'admin_logged_in', {
    path: '/'
  })

  return { ok: true }
})
