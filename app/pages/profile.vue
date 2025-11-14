<script setup lang="ts">
import { updateProfileSchema, type IFormUpdateProfile } from '~/schemas/auth.schema'

const route = useRoute()
const router = useRouter()
const { userInfo } = storeToRefs(useAuthStore())
const { schema } = useSchema(updateProfileSchema)
const { t } = useI18n()

const formRef = ref()
const form = ref<IFormUpdateProfile>({
  lastName: '',
  firstName: '',
  email: '',
  phone: ''
})

watchEffect(() => {
  form.value = {
    firstName: userInfo.value?.firstName || '',
    lastName: userInfo.value?.lastName || '',
    email: userInfo.value?.email || '',
    phone: userInfo.value?.phone || ''
  }
})

// Get current tab from query params, default to 0
const currentTab = computed(() => {
  const tab = route.query.tab
  return tab ? Number(tab) : 0
})

// Handle tab change
const changeTab = (tabIndex: number) => {
  router.push({ query: { tab: tabIndex } })
}

const onSubmit = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (!isValid) {
      return
    }

    console.log('Form is valid, submitting...', form.value)
    // Call API here
  } catch (error) {
    console.error('Validation error:', error)
  }
}
</script>

<template>
  <div class="my-10">
    <p class="text-2xl font-bold mb-10 text-center">{{ t('personal-information') }}</p>

    <div class="flex items-center justify-center gap-4 flex-wrap mb-8">
      <BaseButton :text="t('my-account')" :variant="currentTab === 0 ? 'solid' : 'outline'" @click="changeTab(0)" />
      <BaseButton :text="t('ticket-history')" :variant="currentTab === 1 ? 'solid' : 'outline'" @click="changeTab(1)" />
    </div>

    <div class="max-w-4xl mx-auto px-4">
      <div v-if="currentTab === 0" class="animate-fade-in">
        <p class="text-xl font-semibold mb-4">{{ t('my-account') }}</p>
        <div class="rounded-lg">
          <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="onSubmit">
            <div class="grid grid-cols-2 gap-4">
              <UFormField :label="t('auth.last-name')" name="lastName">
                <UInput v-model="form.lastName" :placeholder="t('auth.last-name')" :ui="{ base: 'h-10' }" class="w-full" />
              </UFormField>
              <UFormField :label="t('auth.first-name')" name="firstName">
                <UInput v-model="form.firstName" :placeholder="t('auth.first-name')" :ui="{ base: 'h-10' }" class="w-full" />
              </UFormField>
              <UFormField :label="t('auth.email')" name="email">
                <UInput v-model="form.email" :placeholder="t('auth.email')" disabled :ui="{ base: 'h-10' }" class="w-full" />
              </UFormField>
              <UFormField :label="t('auth.phone-number')" name="phoneNumber">
                <UInput v-model="form.phone" :placeholder="t('auth.phone-number')" :ui="{ base: 'h-10' }" class="w-full" />
              </UFormField>
            </div>
          </UForm>
        </div>
        <div class="flex justify-end mt-6 gap-4">
          <BaseButton :text="t('change-password')" />
          <BaseButton :text="t('update-information')" variant="solid" @click="onSubmit" />
        </div>
      </div>

      <div v-if="currentTab === 1" class="animate-fade-in">
        <p class="text-xl font-semibold mb-4">{{ t('ticket-history') }}</p>
        <div class="p-6 rounded-lg">
          <p>Nội dung lịch sử mua vé</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
