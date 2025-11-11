<script setup lang="ts">
import {
  emailSchema,
  resetPasswordSchema,
  type IFormEmail,
  type IFormResetPassword,
  type IFormSignIn,
  type IFormSignUp
} from '~/schemas/auth.schema'
import { apiAuth } from '~/services'
import type { DropdownMenuItem } from '@nuxt/ui'

const { verifyOtp, logOut, setTokens } = useAuthStore()
const { userInfo, isAuthenticated, isAdmin } = storeToRefs(useAuthStore())
const { schema } = useSchema(emailSchema)
const { schema: resetPassSchema } = useSchema(resetPasswordSchema)

const toast = useToast()
const { t } = useI18n()
const router = useRouter()

const isOpenModalSignUp = ref(false)
const isOpenModalSignIn = ref(false)
const isOpenModalForgotPassword = ref(false)
const isOpenModalResetPassword = ref(false)
const isLoading = ref(false)
const isOpenModalOtp = ref(false)
const email = ref('')
const otp = ref([])
const tokenOtp = ref('')
const remainingSeconds = ref(90)
const formRef = ref()
const formResetPassRef = ref()
const showPass = ref(false)
const showConfirmPass = ref(false)
const passwordFocused = ref(false)
const form = ref<IFormEmail>({
  email: ''
})
const formResetPass = ref<IFormResetPassword>({
  password: '',
  confirmPassword: ''
})

const isForgotPasswordMode = ref(false)
let intervalId: number | null = null

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
    if (isForgotPasswordMode.value) {
      const { value, message } = await apiAuth.verifyOtpForgotPassword(_otp, tokenOtp.value)
      tokenOtp.value = value.tokenContent
      toast.add({
        title: t('success'),
        description: message,
        color: 'success'
      })
      isOpenModalOtp.value = false
      isOpenModalResetPassword.value = true
    } else {
      await verifyOtp(_otp, tokenOtp.value)

      // Đợi userInfo được cập nhật
      await nextTick()

      toast.add({
        title: t('success'),
        description: 'Đăng nhập thành công!',
        color: 'success'
      })
      isOpenModalOtp.value = false
    }
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
  isForgotPasswordMode.value = true
  isOpenModalSignIn.value = false
  isOpenModalForgotPassword.value = true
  email.value = ''
}

const submitForm = () => {
  if (formRef.value && !isLoading.value) {
    formRef.value.submit()
  }
}
const submitFormResetPass = () => {
  if (formResetPassRef.value) {
    formResetPassRef.value.submit()
  }
}

const handleForgotPassword = async () => {
  try {
    isLoading.value = true
    const { message, value } = await apiAuth.forgotPassword(form.value.email)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    tokenOtp.value = value.tokenContent
    isOpenModalForgotPassword.value = false
    isOpenModalOtp.value = true
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: t('auth.at-least-8-characters') },
    { regex: /\d/, text: t('auth.at-least-1-number') },
    { regex: /[a-z]/, text: t('auth.at-least-1-lowercase-letter') },
    { regex: /[A-Z]/, text: t('auth.at-least-1-uppercase-letter') },
    { regex: /[^A-Za-z0-9]/, text: t('auth.at-least-1-special-character') }
  ]

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(formResetPass.value.password as string))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value < 3) return 'error'
  if (score.value < 5) return 'warning'
  return 'success'
})

const text = computed(() => {
  if (score.value === 0) return t('auth.enter-a-password')
  if (score.value < 3) return t('auth.weak-password')
  if (score.value < 5) return t('auth.medium-password')
  return t('auth.strong-password')
})
function handleConfirmPasswordEnter() {
  if (formResetPass.value.confirmPassword && formResetPass.value.password === formResetPass.value.confirmPassword) {
    submitFormResetPass()
  }
}
const handleResetPassword = async () => {
  try {
    isLoading.value = true
    const { message } = await apiAuth.resetPassword(formResetPass.value.password, tokenOtp.value)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isOpenModalResetPassword.value = false
    isForgotPasswordMode.value = false
    isOpenModalSignIn.value = true
  } catch (error) {
    console.log(error)
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

  <UModal v-model:open="isOpenModalResetPassword" :title="t('header.reset-password')" :ui="{ content: 'w-120' }">
    <template #content>
      <UForm ref="formResetPassRef" :schema="resetPassSchema" :state="formResetPass" class="p-6" @submit="handleResetPassword">
        <div class="flex justify-between items-center w-full">
          <div class="space-y-2 w-full">
            <!-- Password -->
            <UFormField :label="t('auth.password')" name="password" class="w-full">
              <UInput
                ref="passwordRef"
                v-model="formResetPass.password"
                :placeholder="t('auth.password')"
                :color="color"
                :type="showPass ? 'text' : 'password'"
                class="w-full"
                :ui="{ trailing: 'pe-1', base: 'h-10' }"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    @click="showPass = !showPass"
                  />
                </template>
              </UInput>
            </UFormField>

            <div v-if="passwordFocused && formResetPass.password" class="space-y-2">
              <UProgress :color="color" :indicator="text" :model-value="score" :max="5" size="sm" />

              <p id="password-strength" class="text-sm font-medium">{{ text }}. {{ t('auth.must-contain') }}:</p>

              <ul class="space-y-1" :aria-label="t('password-requirements')">
                <li
                  v-for="(req, index) in strength"
                  :key="index"
                  class="flex items-center gap-0.5"
                  :class="req.met ? 'text-success' : 'text-muted'"
                >
                  <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
                  <span class="text-xs font-light">{{ req.text }}</span>
                </li>
              </ul>
            </div>

            <!-- Confirm Password -->
            <UFormField :label="t('auth.confirm-password')" name="confirmPassword" class="w-full">
              <UInput
                id="confirm-password"
                ref="confirmPasswordRef"
                v-model="formResetPass.confirmPassword"
                :placeholder="t('auth.confirm-password')"
                :type="showConfirmPass ? 'text' : 'password'"
                class="w-full"
                :ui="{ trailing: 'pe-1', base: 'h-10' }"
                @keyup.enter="handleConfirmPasswordEnter"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showConfirmPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showConfirmPass ? 'Hide password' : 'Show password'"
                    :aria-pressed="showConfirmPass"
                    aria-controls="confirm-password"
                    @click="showConfirmPass = !showConfirmPass"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>
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
