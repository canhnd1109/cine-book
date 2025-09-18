<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { IFormSignUp } from '~/types/auth.types'
import { SignUpSchema } from '~/types/auth.types'

const { t } = useI18n()

const showPass = ref(false)
const showConfirmPass = ref(false)
const passwordFocused = ref(false)

const form = reactive<Partial<IFormSignUp>>({
  lastName: '',
  firstName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<IFormSignUp>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /\d/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    { regex: /[^A-Za-z0-9]/, text: 'At least 1 special character' }
  ]

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(form.password as string))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value < 3) return 'error'
  if (score.value < 5) return 'warning'
  return 'success'
})

const text = computed(() => {
  if (score.value === 0) return 'Enter a password'
  if (score.value < 3) return 'Weak password'
  if (score.value < 5) return 'Medium password'
  return 'Strong password'
})
</script>

<template>
  <div class="flex justify-between m-6 items-center mx-10">
    <div>logo</div>
    <div class="flex justify-end gap-x-6">
      <UModal :title="t('header.signup')">
        <BaseButton
          :text="t('header.signup')"
        />

        <template #body>
          <UForm
            :schema="SignUpSchema"
            :state="form"
            class="space-y-4"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="Họ"
                name="lastName"
              >
                <UInput
                  v-model="form.lastName"
                  :ui="{ base: 'h-10' }"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Tên"
                name="firstName"
              >
                <UInput
                  v-model="form.firstName"
                  :ui="{ base: 'h-10' }"
                  class="w-full"
                />
              </UFormField>
            </div>
            <UFormField
              label="Email"
              name="email"
            >
              <UInput
                v-model="form.email"
                :ui="{ base: 'h-10' }"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Số điện thoại"
              name="phoneNumber"
            >
              <UInput
                v-model="form.phoneNumber"
                :ui="{ base: 'h-10' }"
                class="w-full"
              />
            </UFormField>
            <div class="flex justify-between items-center w-full">
              <div class="space-y-2 w-full">
                <!-- Password -->
                <UFormField
                  label="Password"
                  name="password"
                  class="w-full"
                >
                  <UInput
                    v-model="form.password"
                    placeholder="Password"
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

                <!-- Chỉ hiển thị khi có password và đang focus -->
                <div
                  v-if="passwordFocused && form.password"
                  class="space-y-2"
                >
                  <UProgress
                    :color="color"
                    :indicator="text"
                    :model-value="score"
                    :max="5"
                    size="sm"
                  />

                  <p
                    id="password-strength"
                    class="text-sm font-medium"
                  >
                    {{ text }}. Must contain:
                  </p>

                  <ul
                    class="space-y-1"
                    aria-label="Password requirements"
                  >
                    <li
                      v-for="(req, index) in strength"
                      :key="index"
                      class="flex items-center gap-0.5"
                      :class="req.met ? 'text-success' : 'text-muted'"
                    >
                      <UIcon
                        :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                        class="size-4 shrink-0"
                      />
                      <span class="text-xs font-light">{{ req.text }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Confirm Password -->
                <UFormField
                  label="Confirm Password"
                  name="confirmPassword"
                  class="w-full"
                >
                  <UInput
                    v-model="form.confirmPassword"
                    placeholder="Confirm Password"
                    :type="showConfirmPass ? 'text' : 'password'"
                    class="w-full"
                    :ui="{ trailing: 'pe-1', base: 'h-10' }"
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
          <BaseButton
            :text="t('header.signup')"
            variant="solid"
            class-name="w-full mt-6 flex justify-center"
          />
          <p class="text-center mt-4">
            Bạn đã có tài khoản?
            <span class="underline text-[#00e080] hover:cursor-pointer">Đăng nhập</span>
          </p>
        </template>
      </UModal>
      <BaseButton
        :text="t('header.signin')"
        variant="solid"
      />
    </div>
    <div class="flex justify-end items-center !gap-x-4">
      <BaseLanguagesLanguageSwitcher />
      <UColorModeButton :ui="{ base: 'cursor-pointer' }" />
    </div>
  </div>
</template>

<style scoped>

</style>
