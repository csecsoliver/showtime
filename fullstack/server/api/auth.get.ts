export default defineEventHandler(async (event) => {
  return { auth: event.context.userType == "user", email: event.context.user?.email??"" };
});
