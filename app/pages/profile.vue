<script setup lang="ts">
import { updateProfileSchema, type IFormChangePassword, type IFormUpdateProfile } from '~/schemas/auth.schema'
import { apiPublic, apiUser } from '~/services'
import type { IBooking } from '~/types/booking.type'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

const table = useTemplateRef('table')
const route = useRoute()
const router = useRouter()
const { userInfo } = storeToRefs(useAuthStore())
const { schema } = useSchema(updateProfileSchema)
const { t } = useI18n()
const toast = useToast()
const { getUserInfo } = useAuthStore()

const isProcessing = ref(false)
const isOpenModalChangePassword = ref(false)
const bookings = ref<IBooking[]>([])

const formRef = ref()
const form = ref<IFormUpdateProfile>({
  lastName: '',
  firstName: '',
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
    isProcessing.value = true
    const { message } = await apiUser.updateProfile(form.value)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    await getUserInfo()
  } catch (error) {
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

const handleChangePassword = async (form: IFormChangePassword) => {
  try {
    isProcessing.value = true
    const { message } = await apiUser.changePassword(form)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isOpenModalChangePassword.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}
const pagination = ref({
  pageIndex: 0,
  pageSize: 50
})

const { data, pending } = await useAsyncData('booking-list', async () => {
  const { value } = await apiPublic.fetchBooking()
  return value
})
watchEffect(() => {
  bookings.value = data.value || []
})
const columns: TableColumn<IBooking>[] = [
  {
    accessorKey: 'stt',
    header: 'STT',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'movieName',
    header: 'Movie Name'
  },

  {
    accessorKey: 'genreName',
    header: 'Genre'
  },
  {
    accessorKey: 'cinemaName',
    header: 'Cinema Name'
  },
  {
    accessorKey: 'roomName',
    header: 'Room Name'
  },
  {
    accessorKey: 'seatNames',
    header: 'Seat Names'
  },
  {
    accessorKey: 'cinemaAddress',
    header: 'Cinema Address'
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status'
  },
  {
    accessorKey: 'totalPrice',
    header: () => h('div', { class: 'text-right' }, 'Total Price'),
    cell: ({ row }) => {
      return h('div', { class: 'text-right font-medium' }, formatPrice(row.getValue('totalPrice')))
    }
  }
]
</script>

<template>
  <div class="my-10">
    <p class="text-2xl font-bold mb-10 text-center">{{ t('personal-information') }}</p>

    <div class="flex items-center justify-center gap-4 flex-wrap mb-8">
      <BaseButton :text="t('my-account')" :variant="currentTab === 0 ? 'solid' : 'outline'" @click="changeTab(0)" />
      <BaseButton :text="t('ticket-history')" :variant="currentTab === 1 ? 'solid' : 'outline'" @click="changeTab(1)" />
    </div>

    <div>
      <div v-if="currentTab === 0" class="animate-fade-in max-w-4xl mx-auto px-4">
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
          <BaseButton :text="t('change-password')" @click="isOpenModalChangePassword = true" />
          <BaseButton
            :text="t('update-information')"
            :is-loading="isProcessing"
            :is-disable="isProcessing"
            variant="solid"
            @click="onSubmit"
          />
        </div>
      </div>

      <div
        v-if="currentTab === 1"
        class="animate-fade-in mx-10 border border-solid border-border-light dark:border-border-dark p-6 rounded-lg"
      >
        <div class="w-full space-y-4 pb-4">
          <UTable
            ref="table"
            v-model:pagination="pagination"
            :loading="pending"
            :data="data"
            :columns="columns"
            :pagination-options="{
              getPaginationRowModel: getPaginationRowModel()
            }"
            class="flex-1"
          />

          <div class="flex justify-center border-t border-default pt-4">
            <UPagination
              :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length"
              @update:page="p => table?.tableApi?.setPageIndex(p - 1)"
            />
          </div>
        </div>
      </div>
      <AuthModalChangePassword
        v-model:is-open="isOpenModalChangePassword"
        :is-loading="isProcessing"
        @submit="handleChangePassword"
      />
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
