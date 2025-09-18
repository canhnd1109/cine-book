<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { createSignUpSchema, type IFormSignUp } from '~/schemas/auth.schema'

const { t } = useI18n()

const { schema: signUpSchema } = useSchema(createSignUpSchema)

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
    { regex: /.{8,}/, text: t('auth.at-least-8-characters') },
    { regex: /\d/, text: t('auth.at-least-1-number') },
    { regex: /[a-z]/, text: t('auth.at-least-1-lowercase-letter') },
    { regex: /[A-Z]/, text: t('auth.at-least-1-uppercase-letter') },
    { regex: /[^A-Za-z0-9]/, text: t('auth.at-least-1-special-character') }
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
  if (score.value === 0) return t('auth.enter-a-password')
  if (score.value < 3) return t('auth.weak-password')
  if (score.value < 5) return t('auth.medium-password')
  return t('auth.strong-password')
})
</script>

<template>
  <UModal :title="t('header.signup')">
    <BaseButton
      :text="t('header.signup')"
    />

    <template #body>
      <UForm
        :schema="signUpSchema"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField
            :label="t('auth.last-name')"
            name="lastName"
          >
            <UInput
              v-model="form.lastName"
              :placeholder="t('auth.last-name')"
              :ui="{ base: 'h-10' }"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :label="t('auth.first-name')"
            name="firstName"
          >
            <UInput
              v-model="form.firstName"
              :placeholder="t('auth.first-name')"
              :ui="{ base: 'h-10' }"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField
          :label="t('auth.email')"
          name="email"
        >
          <UInput
            v-model="form.email"
            :placeholder="t('auth.email')"
            :ui="{ base: 'h-10' }"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="t('auth.phone-number')"
          name="phoneNumber"
        >
          <UInput
            v-model="form.phoneNumber"
            :placeholder="t('auth.phone-number')"
            :ui="{ base: 'h-10' }"
            class="w-full"
          />
        </UFormField>
        <div class="flex justify-between items-center w-full">
          <div class="space-y-2 w-full">
            <!-- Password -->
            <UFormField
              :label="t('auth.password')"
              name="password"
              class="w-full"
            >
              <UInput
                v-model="form.password"
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
                {{ text }}. {{ t('auth.must-contain') }}:
              </p>

              <ul
                class="space-y-1"
                :aria-label="t('password-requirements')"
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
              :label="t('auth.confirm-password')"
              name="confirmPassword"
              class="w-full"
            >
              <UInput
                v-model="form.confirmPassword"
                :placeholder="t('auth.confirm-password')"
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
        {{ t('auth.already-have-an-account?') }}
        <span class="underline text-[#00e080] hover:cursor-pointer">{{ t('header.signin') }}</span>
      </p>
    </template>
  </UModal>
</template>

<style scoped>

</style>
