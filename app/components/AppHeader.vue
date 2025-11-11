<script setup lang="ts">
import { emailSchema, type IFormEmail, type IFormSignIn, type IFormSignUp } from '~/schemas/auth.schema'
import { apiAuth } from '~/services'
import type { DropdownMenuItem } from '@nuxt/ui'

const { verifyOtp, logOut } = useAuthStore()
const { userInfo, isAuthenticated, isAdmin } = storeToRefs(useAuthStore())
const { schema } = useSchema(emailSchema)

const toast = useToast()
const { t } = useI18n()
const router = useRouter()

const isOpenModalSignUp = ref(false)
const isOpenModalSignIn = ref(false)
const isOpenModalForgotPassword = ref(false)
const isLoading = ref(false)
const isOpenModalOtp = ref(false)
const email = ref('')
const otp = ref([])
const tokenOtp = ref('')
const remainingSeconds = ref(90)
let intervalId: number | null = null
const formRef = ref()
const form = ref<IFormEmail>({
  email: ''
})

const openModalSignIn = () => {
  if (isOpenModalSignUp.value) {
    isOpenModalSignUp.value = false
  }
  isOpenModalSignIn.value = true
}
const openModalSignUp = () => {
  if (isOpenModalSignIn.value) {
    isOpenModalSignIn.value = false
  }
  isOpenModalSignUp.value = true
}

async function handleSignUp(form: IFormSignUp) {
  if (isLoading.value) return
  try {
    isLoading.value = true
    const rs = await apiAuth.register(form)
    toast.add({
      title: t('success'),
      description: rs.message,
      color: 'success'
    })
    isOpenModalSignUp.value = false
    isOpenModalSignIn.value = true
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const handelSignIn = async (form: IFormSignIn) => {
  if (isLoading.value) return
  try {
    isLoading.value = true
    email.value = form.email
    const rs = await apiAuth.login(form)
    toast.add({
      title: t('success'),
      description: rs.message,
      color: 'success'
    })

    if (rs.value.tokenContent) {
      tokenOtp.value = rs.value.tokenContent
      isOpenModalSignIn.value = false
      isOpenModalOtp.value = true
      startTimer()
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const handleVedifyOtp = async () => {
  if (isLoading.value) return
  try {
    isLoading.value = true
    const _otp = otp.value.join('')
    await verifyOtp(_otp, tokenOtp.value)

    // Đợi userInfo được cập nhật
    await nextTick()

    isOpenModalOtp.value = false

    toast.add({
      title: t('success'),
      description: 'Đăng nhập thành công!',
      color: 'success'
    })
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const isAlmostExpired = computed(() => {
  return remainingSeconds.value <= 10
})

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Start the timer interval
const startTimer = () => {
  if (intervalId !== null) return

  intervalId = window.setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    }
  }, 1000)
}
const isDisableVerifyOtp = computed(() => {
  return otp.value.length < 6
})

const items = computed<DropdownMenuItem[][]>(() => {
  const menuItems: DropdownMenuItem[][] = []

  if (isAdmin.value) {
    menuItems.push([
      {
        label: 'Quản trị',
        icon: 'i-lucide-shield',
        onSelect() {
          router.push('/admin')
        }
      }
    ])
  }

  // Add user profile menu
  menuItems.push([
    {
      label: 'Thông tin cá nhân',
      icon: 'i-lucide-user',
      onSelect() {
        router.push({ path: '/profile', query: { tab: 0 } })
      }
    }
  ])

  // Add logout menu
  menuItems.push([
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect() {
        logOut()
      }
    }
  ])

  return menuItems
})

const forgotPassword = () => {
  isOpenModalSignIn.value = false
  isOpenModalForgotPassword.value = true
  email.value = ''
}

const submitForm = () => {
  if (formRef.value && !isLoading.value) {
    formRef.value.submit()
  }
}
const handleForgotPassword = async () => {
  try {
    isLoading.value = true
    const { message } = await apiAuth.forgotPassword(form.value.email)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })

    isOpenModalForgotPassword.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <header class="m-6 mx-10">
    <div class="flex justify-between items-center">
      <div class="hover:cursor-pointer" @click="router.push('/')">
        <img src="/images/logo.png" alt="logo" />
      </div>
      <nav aria-label="Primary" class="flex justify-end items-center gap-x-8 text-lg">
        <NuxtLink to="/" class="hover:text-primary">Trang chủ</NuxtLink>
        <!-- /movie-schedules -->
        <NuxtLink to="/" class="hover:text-primary">Lịch chiếu</NuxtLink>
      </nav>
      <div class="flex justify-end items-center !gap-x-4">
        <div v-if="!isAuthenticated" class="flex justify-end items-center !gap-x-4">
          <BaseButton :text="t('header.signup')" title="Sign up" @click="isOpenModalSignUp = true" />
          <BaseButton :text="t('header.signin')" variant="solid" title="Sign in" @click="isOpenModalSignIn = true" />
        </div>

        <UDropdownMenu v-else :items="items" class="mx-6" :ui="{ itemLabel: 'cursor-pointer' }" :arrow="true">
          <div class="flex justify-center gap-2 items-center hover:cursor-pointer">
            <UAvatar :alt="userInfo?.firstName" size="md" />
            <p>{{ userInfo?.firstName }}</p>
          </div>
        </UDropdownMenu>

        <BaseLanguages />
        <UColorModeButton class="hover:cursor-pointer" :icon-light="'i-ph-sun'" :icon-dark="'i-ph-moon'" />
      </div>
    </div>
  </header>
  <AuthModalSignUp
    v-model:is-open="isOpenModalSignUp"
    :is-loading="isLoading"
    @sign-in="openModalSignIn"
    @sign-up="handleSignUp"
  />
  <AuthModalSignIn
    v-model:is-open="isOpenModalSignIn"
    :is-loading="isLoading"
    @sign-up="openModalSignUp"
    @sign-in="handelSignIn"
    @forgot-password="forgotPassword"
  />

  <UModal v-model:open="isOpenModalForgotPassword" :title="t('header.forgot-password')" :ui="{ content: 'w-120' }">
    <template #content>
      <UForm ref="formRef" :schema :state="form" class="p-6" @submit="handleForgotPassword">
        <UFormField :label="t('auth.email')" name="email">
          <UInput
            v-model="form.email"
            :loading="isLoading"
            loading-icon="i-lucide-loader"
            :placeholder="t('auth.email')"
            :ui="{ base: 'h-10' }"
            class="w-full"
            @keyup.enter="submitForm"
          />
        </UFormField>
      </UForm>
    </template>
  </UModal>

  <UModal v-model:open="isOpenModalOtp" :ui="{ content: 'w-120' }">
    <template #content>
      <div class="w-full mx-auto items-center p-6">
        <p class="text-center text-lg font-bold mb-6">Check your email</p>
        <p class="text-center text-[#62748e]">Enter the verification code sent to</p>
        <p class="text-center">{{ email }}</p>
        <UPinInput
          v-model="otp"
          :length="6"
          size="xl"
          class="flex mt-6 justify-center items-center"
          @keyup.enter="otp.length === 6 && handleVedifyOtp()"
        />
        <p class="text-center my-6" :class="{ 'text-error': isAlmostExpired }">{{ formattedTime }}</p>
        <div class="flex justify-center">
          <BaseButton
            :is-disable="isDisableVerifyOtp"
            :is-loading="isLoading"
            text="Verify email"
            title="Verify email"
            class="w-80"
            variant="solid"
            @click="handleVedifyOtp"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.router-link-active {
  font-weight: 600;
  color: var(--color-primary);
}
</style>
