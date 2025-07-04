export default defineEventHandler(async (event) => {
  return { auth: event.context.auth, email: event.context.user.email };
})
