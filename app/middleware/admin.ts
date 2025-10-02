export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { getUserInfo } = useAuthStore()
  const { isAuthenticated, isAdmin, userInfo } = storeToRefs(useAuthStore())
  const toast = useToast()
  const language = useCookie('i18n_redirected')

  if (isAuthenticated.value && !userInfo.value) {
    await getUserInfo()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/')
  }

  if (!isAdmin.value) {
    toast.add({
      title: language.value === 'en' ? 'Error' : 'Lỗi',
      description: 'Bạn không có quyền truy cập vào trang này',
      color: 'error'
    })
    return navigateTo('/')
  }
})
