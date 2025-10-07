<script setup lang="ts">
import { createSignInSchema, type IFormSignIn } from '~/schemas/auth.schema'

const { t } = useI18n()
const showPass = ref(false)
const { schema: signInSchema } = useSchema(createSignInSchema)
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const formRef = ref()

const { isLoading } = defineProps<{
  isLoading?: boolean
}>()

const emits = defineEmits<{
  'sign-up': []
  'sign-in': [form: IFormSignIn]
}>()

const form = ref<IFormSignIn>({
  email: '',
  password: ''
})

const submitForm = () => {
  if (formRef.value && !isLoading) {
    formRef.value.submit()
  }
}
const canSubmit = computed(() => {
  return form.value.email && form.value.password && !isLoading
})
</script>

<template>
  <ClientOnly>
    <UModal v-model:open="isOpen" :title="t('header.signin')" class="w-1/3">
      <template #body>
        <UForm ref="formRef" :schema="signInSchema" :state="form" class="space-y-4" @submit="emits('sign-in', form)">
          <UFormField :label="t('auth.email')" name="email">
            <UInput v-model="form.email" :placeholder="t('auth.email')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('auth.password')" name="password" class="w-full">
            <UInput
              v-model="form.password"
              :placeholder="t('auth.password')"
              :type="showPass ? 'text' : 'password'"
              class="w-full"
              :ui="{ trailing: 'pe-1', base: 'h-10' }"
              @keyup.enter="submitForm"
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
        </UForm>
        <p class="text-end mt-4 underline text-primary hover:cursor-pointer">
          {{ t('auth.forgot-password') }}
        </p>
        <BaseButton
          :text="t('header.signin')"
          :is-loading="isLoading"
          :disabled="!canSubmit"
          variant="solid"
          class-name="w-full mt-6 flex justify-center"
          @click="submitForm"
        />
        <p class="text-center mt-4">
          {{ t('auth.don-not-have-an-account?') }}
          <span class="underline text-primary hover:cursor-pointer" @click="emits('sign-up')">{{ t('header.signup') }}</span>
        </p>
      </template>
    </UModal>
  </ClientOnly>
</template>

<style scoped></style>
