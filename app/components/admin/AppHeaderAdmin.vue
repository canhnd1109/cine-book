<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { userInfo } = storeToRefs(useAuthStore())
const { logOut } = useAuthStore()

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'Thông tin cá nhân',
      icon: 'i-lucide-user',
      onSelect() {
        console.log('New team clicked')
      }
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect() {
        logOut()
      }
    }
  ]
]
</script>

<template>
  <div class="flex justify-end items-center !gap-x-4 p-4">
    <UDropdownMenu :items="items" class="mx-6" :ui="{ itemLabel: 'cursor-pointer' }" :arrow="true">
      <div class="flex justify-center gap-2 items-center hover:cursor-pointer">
        <UAvatar :alt="userInfo?.firstName" size="md" />
        <p>{{ userInfo?.firstName }}</p>
      </div>
    </UDropdownMenu>

    <BaseLanguages />
    <UColorModeButton class="hover:cursor-pointer" :icon-light="'i-ph-sun'" :icon-dark="'i-ph-moon'" />
  </div>
</template>

<style scoped></style>
