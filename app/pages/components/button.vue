<template>
  <div class="mx-20 my-10">
    <h1 class="font-bold text-2xl mb-5 shadow-none">
      Button
    </h1>
    <div class="flex gap-5">
      <BaseButton
        text="Button"
      />
      <BaseButton
        text="Button"
        :is-disable="true"
      />

      <BaseButton
        text="Button"
        variant="solid"
      />
      <BaseButton
        text="Button"
        variant="solid"
        :is-disable="true"
      />
      <BaseButton
        text="Button"
        variant="solid"
        :is-loading="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/button/BaseButton.vue'

useSeoMeta({ title: 'Components - Button' })
</script>

<style scoped>

</style>
