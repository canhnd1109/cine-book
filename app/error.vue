<script setup lang="ts">
const appConfig = useAppConfig()
useSeoMeta({ title: appConfig.pages['not-found'].title })
definePageMeta({ layout: 'blank' })
</script>

<template>
  <div class="h-screen w-screen overflow-hidden relative flex justify-center dark:bg-white">
    <div class="page-not-found" />
    <div class="flex h-screen w-screen items-center justify-center space-x-8 max-lg:block max-lg:px-6 max-sm:pt-20">
      <img alt="404 Raket Mascot" src="/images/raket-error.png" class="flex items-center justify-center" />
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-[#ff7e20]">Page Not Found</h2>
        <p class="text-6xl font-bold text-[#1e2225]">Oh No! Error 404</p>
        <p class="text-lg text-[#959799]">
          The page you are looking for might have been removed had its name changed or is temporarily unavailable.
        </p>
        <div class="mt-7 cursor-pointer py-4" @click="navigateTo(appConfig.pages.home.path)">
          <span class="inline rounded-full bg-[#ff7e20] px-6 py-4 font-semibold text-white hover:bg-[#FF974D]">Back to Home</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-not-found {
  position: absolute;
  width: 100%;
  height: 100%;
  max-height: 1572px;
  top: -61px;
  z-index: -1;
  background-image: url('/images/desktop_background.png');
  -webkit-background-size: cover;
  background-size: cover;
  -webkit-animation: animation-1o0baec 9s ease infinite;
  animation: animation-1o0baec 9s ease infinite;
  -webkit-background-position: center center;
  background-position: center center;
  -webkit-filter: blur(100px);
  filter: blur(100px);
  opacity: 0.6;
}
.page-not-found::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), #ffffff);
  height: 200px;
  width: 100%;
}

@keyframes animation-1o0baec {
  0% {
    -webkit-transform: translate(-5%, -10%);
    -moz-transform: translate(-5%, -10%);
    -ms-transform: translate(-5%, -10%);
    transform: translate(-5%, -10%);
  }
  25% {
    -webkit-transform: translate(15%, -10%);
    -moz-transform: translate(15%, -10%);
    -ms-transform: translate(15%, -10%);
    transform: translate(15%, -10%);
  }
  50% {
    -webkit-transform: translate(15%, 15%);
    -moz-transform: translate(15%, 15%);
    -ms-transform: translate(15%, 15%);
    transform: translate(15%, 15%);
  }
  75% {
    -webkit-transform: translate(-5%, 15%);
    -moz-transform: translate(-5%, 15%);
    -ms-transform: translate(-5%, 15%);
    transform: translate(-5%, 15%);
  }
  100% {
    -webkit-transform: translate(-5%, -10%);
    -moz-transform: translate(-5%, -10%);
    -ms-transform: translate(-5%, -10%);
    transform: translate(-5%, -10%);
  }
}
</style>
