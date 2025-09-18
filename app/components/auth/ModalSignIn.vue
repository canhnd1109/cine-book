<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { createSignInChema, type IFormSignIn } from '~/schemas/auth.schema'

const { t } = useI18n()
const showPass = ref(false)
const signInSchema = createSignInChema(t)

const form = reactive<Partial<IFormSignIn>>({
  email: '',
  password: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<IFormSignIn>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UModal :title="t('header.signin')">
    <BaseButton
      :text="t('header.signin')"
      variant="solid"
    />
    <template #body>
      <UForm
        :schema="signInSchema"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
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
          :label="t('auth.password')"
          name="password"
          class="w-full"
        >
          <UInput
            v-model="form.password"
            :placeholder="t('auth.password')"
            :type="showPass ? 'text' : 'password'"
            class="w-full"
            :ui="{ trailing: 'pe-1', base: 'h-10' }"
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
      <p class="text-end mt-4 underline text-[#00e080] hover:cursor-pointer">
        {{ t('auth.forgot-password') }}
      </p>
      <BaseButton
        :text="t('header.signin')"
        variant="solid"
        class-name="w-full mt-6 flex justify-center"
      />
      <p class="text-center mt-4">
        {{ t('auth.don-not-have-an-account?') }}
        <span class="underline text-[#00e080] hover:cursor-pointer">{{ t('header.signup') }}</span>
      </p>
    </template>
  </UModal>
</template>

<style scoped>

</style>
