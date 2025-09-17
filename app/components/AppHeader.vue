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
            :validate="validate"
            :state="form"
            class="space-y-4"
            @submit="onSubmit"
          >
            <div class="flex justify-between items-center">
              <UFormField
                label="Họ"
                name="lastName"
              >
                <UInput
                  v-model="form.lastName"
                  class="w-56"
                />
              </UFormField>
              <UFormField
                label="Tên"
                name="firstName"
              >
                <UInput
                  v-model="form.firstName"
                  class="w-56"
                />
              </UFormField>
            </div>
            <UFormField
              label="Email"
              name="email"
            >
              <UInput
                v-model="form.email"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Số điện thoại"
              name="phoneNumber"
            >
              <UInput
                v-model="form.phoneNumber"
                class="w-full"
              />
            </UFormField>
            <div class="flex justify-between items-center w-full">
              <div class="space-y-2 w-full">
                <UFormField
                  label="Password"
                  class="w-full"
                >
                  <UInput
                    v-model="form.password"
                    placeholder="Password"
                    :color="color"
                    :type="show ? 'text' : 'password'"
                    :aria-invalid="score < 4"
                    aria-describedby="password-strength"
                    :ui="{ trailing: 'pe-1' }"
                    class="w-full"
                  >
                    <template #trailing>
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="show ? 'Hide password' : 'Show password'"
                        :aria-pressed="show"
                        aria-controls="password"
                        @click="show = !show"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <UProgress
                  :color="color"
                  :indicator="text"
                  :model-value="score"
                  :max="4"
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

                    <span class="text-xs font-light">
                      {{ req.text }}
                      <span class="sr-only">
                        {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                      </span>
                    </span>
                  </li>
                </ul>
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

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { IFormSignUp } from '~/types/auth.types'

const { t } = useI18n()

const show = ref(false)
const form = reactive<IFormSignUp>({
  lastName: '',
  firstName: '',
  email: '',
  phoneNumber: '',
  password: ''
})
/* eslint-disable  @typescript-eslint/no-explicit-any */
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<typeof form>) {
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

const strength = computed(() => checkStrength(form.password))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 1) return 'error'
  if (score.value <= 2) return 'warning'
  if (score.value === 3) return 'warning'
  return 'success'
})

const text = computed(() => {
  if (score.value === 0) return 'Enter a password'
  if (score.value <= 2) return 'Weak password'
  if (score.value === 3) return 'Medium password'
  return 'Strong password'
})
</script>

<style scoped>

</style>
