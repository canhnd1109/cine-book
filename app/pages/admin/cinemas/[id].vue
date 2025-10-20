<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})
const { cinameDetail } = useCinemaData()

const { t } = useI18n()
</script>
<template>
  <div class="card-box">
    <p class="text-lg font-medium text-primary text-center">
      {{ t('theater-information') }} <span class="uppercase">{{ cinameDetail.name }}</span>
    </p>

    <div class="border-b border-solid border-border-light dark:border-border-dark pb-4">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
        <img v-for="(item, index) in cinameDetail.urlImages" :key="index" :src="item" class="w-full h-60 object-cover rounded" />
      </div>
      <p>
        <span class="text-secondary text-sm">{{ $t('address') }}: </span>
        <span>{{ cinameDetail.province }} - {{ cinameDetail.commune }} - {{ cinameDetail.detailAddress }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('phone') }}: </span>
        <span>{{ cinameDetail.phone }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('status') }}: </span>
        <span>{{ cinameDetail.status }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('description') }}: </span>
        <span>{{ cinameDetail.description }}</span>
      </p>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-lg font-medium text-primary">{{ t('room-management') }}</p>
      <BaseButton :text="t('add')" variant="solid" class-name="rounded" />
    </div>
  </div>
</template>

<style scoped></style>
