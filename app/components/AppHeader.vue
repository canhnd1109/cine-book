<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { IFormSignUp } from '~/schemas/auth.schema'
import { apiAuth } from '~/services'

const toast = useToast()
const { t } = useI18n()

const modalSignUp = ref(false)
const modalSignIn = ref(false)
const isLoading = ref(false)

const openModalSignIn = () => {
  if (modalSignUp.value) {
    modalSignUp.value = false
  }
  modalSignIn.value = true
}
const openModalSignUp = () => {
  if (modalSignIn.value) {
    modalSignIn.value = false
  }
  modalSignUp.value = true
}

async function handleSignUp(form: IFormSignUp) {
  if (isLoading.value) return
  try {
    isLoading.value = true
    const rs = await apiAuth.register(form)
    toast.add({
      title: t('success'),
      description: rs.message,
      color: 'success',
    })
    modalSignUp.value = false
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Registration failed. Please try again.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <header class="m-6 mx-10">
    <div class="flex justify-between items-center">
      <div class="text-xl font-semibold">
        logo
      </div>
      <nav
        aria-label="Primary"
        class="flex justify-end items-center gap-x-8 text-lg"
      >
        <NuxtLink
          to="/"
          class="hover:text-primary"
        >Trang chủ</NuxtLink>
        <!-- /movie-schedules -->
        <NuxtLink
          to="/"
          class="hover:text-primary"
        >Lịch chiếu</NuxtLink>
      </nav>
      <div class="flex justify-end items-center !gap-x-4">
        <BaseButton
          :text="t('header.signup')"
          title="Sign up"
          @click="modalSignUp = true"
        />
        <BaseButton
          :text="t('header.signin')"
          variant="solid"
          title="Sign in"
          @click="modalSignIn = true"
        />
        <BaseLanguages />
        <BaseTheme />
      </div>
    </div>
  </header>
  <AuthModalSignUp
    :is-loading="isLoading"
    v-model:is-open="modalSignUp"
    @sign-in="openModalSignIn"
    @sign-up="handleSignUp"
  />
  <AuthModalSignIn
    v-model:is-open="modalSignIn"
    @sign-up="openModalSignUp"
  />
</template>

<style scoped>
.router-link-active {
  font-weight: 600;
  color: var(--color-primary);
}
</style>
