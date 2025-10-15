<template>
  <div class="dark:bg-[#0B0D13] bg-light-bg p-8 mx-auto space-y-6 background">
    <p class="flex justify-center items-center gap-8 text-base">
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.policy') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.showtime') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.news') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.price-ticket') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.faq') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.group-booking') }}
      </span>
      <span class="hover:cursor-pointer hover:scale-110 hover:font-semibold transition-transform duration-200 inline-block">
        {{ t('footer.contact') }}
      </span>
    </p>
    <div class="flex justify-center items-center mx-auto bg-[#78140f] rounded-full w-84 py-2">
      <img src="/images/vietnam.png" alt="Vietnam" class="w-6 h-6 object-cover" />
      <span class="text-white">Hoàng Sa & Trường Sa là của Việt Nam!</span>
    </div>
    <div class="flex justify-center gap-6">
      <img
        src="/images/fb-logo.png"
        alt="Facebook"
        loading="lazy"
        class="w-8 h-8 rounded-full object-cover hover:cursor-pointer"
      />
      <img src="/images/zalo-logo.png" alt="Zalo" loading="lazy" class="w-8 h-8 rounded-full object-cover hover:cursor-pointer" />
      <img
        src="/images/youtube-logo.png"
        alt="Youtube"
        loading="lazy"
        class="w-8 h-8 rounded-full object-cover hover:cursor-pointer"
      />
      <img src="/images/googleplay.png" alt="Google Play" loading="lazy" class="w-36 object-contain h-10 hover:cursor-pointer" />
      <img src="/images/appstore.png" alt="App Store" loading="lazy" class="w-36 object-contain h-10 hover:cursor-pointer" />
      <img src="/images/certification.png" alt="Bản quyền" loading="lazy" class="w-36 object-contain h-10" />
    </div>
    <div class="space-y-2">
      <p class="text-center">
        {{ t('footer.line-1') }}
      </p>
      <p class="text-center">
        {{ t('footer.line-2') }}
      </p>
      <p class="text-center">
        {{ t('footer.line-3') }}
      </p>
      <p class="text-center">
        {{ t('footer.line-4') }}
      </p>
      <p class="text-center text-sm">
        {{ t('footer.line-5') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
.background {
  background-image: url(/images/footer-image.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
