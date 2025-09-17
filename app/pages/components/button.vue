<template>
  <div>
    <h1 class="font-bold text-2xl mb-5">
      Button
    </h1>
    <div class="flex gap-5">
      <BaseButton text="Button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/button/BaseButton.vue'

useSeoMeta({ title: 'Components - Button' })
</script>

<style scoped>

</style>
