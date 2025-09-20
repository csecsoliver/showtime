export default defineNuxtRouteMiddleware(() => {
  try {
    const session = useUserSession();
    if (!session.loggedIn.value) {
      return navigateTo("/login");
    }
  } catch {
    return navigateTo("/login");
  }
  
});