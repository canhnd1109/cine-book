export default defineNuxtPlugin(async () => {
  const { getUserInfo } = useAuthStore()
  const { isAuthenticated } = storeToRefs(useAuthStore())

  if (isAuthenticated.value) {
    await getUserInfo()
  }
})
