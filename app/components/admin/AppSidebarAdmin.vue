<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const sidebarAdmin = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: '/admin'
  },
  {
    name: 'Movies',
    icon: 'movie',
    path: '/admin/movies'
  }
]

function isActive(path: string) {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="flex-col w-60 dark:bg-bg-primary-dark rounded-lg bg-bg-light m-6 p-4 space-y-2">
    <div class="cursor-pointer" @click="router.push('/')">logo</div>
    <div v-for="(item, index) in sidebarAdmin" :key="index">
      <p
        class="flex justify-start items-center gap-2 hover:cursor-pointer hover:bg-gray-200 p-2 rounded-md hover:text-primary"
        :class="isActive(item.path) ? '!bg-primary !text-white font-bold' : ''"
        @click="router.push(item.path)"
      >
        <BaseIcon :name="item.icon" />
        <span>{{ item.name }}</span>
      </p>
    </div>
  </div>
</template>
