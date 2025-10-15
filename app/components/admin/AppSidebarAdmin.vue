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
  },
  {
    name: 'Cinemas',
    icon: 'cinema',
    path: '/admin/cinemas'
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
  <div class="w-60 dark:bg-bg-seconary-dark rounded-lg bg-white my-6 ml-6 p-4 space-y-2">
    <div class="cursor-pointer mb-6" @click="router.push('/')">
      <img src="/images/logo.png" alt="logo" />
    </div>
    <div v-for="(item, index) in sidebarAdmin" :key="index">
      <p
        class="flex justify-start items-center gap-2 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-bg-primary-dark p-2 rounded-md hover:text-primary"
        :class="isActive(item.path) ? '!bg-primary !text-white font-bold' : ''"
        @click="router.push(item.path)"
      >
        <BaseIcon :name="item.icon" />
        <span>{{ item.name }}</span>
      </p>
    </div>
  </div>
</template>
