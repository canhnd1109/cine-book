<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between m-6 items-center mx-10">
    <div>logo</div>
    <div class="flex justify-end gap-x-6">
      <AuthModalSignUp />
      <BaseButton
        :text="t('header.signin')"
        variant="solid"
      />
    </div>
    <div class="flex justify-end items-center !gap-x-4">
      <BaseLanguagesLanguageSwitcher />
      <UColorModeButton :ui="{ base: 'cursor-pointer' }" />
    </div>
  </div>
</template>

<style scoped>

</style>
