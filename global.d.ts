declare module 'swiper/css'
declare module 'swiper/css/effect-fade'
declare module 'swiper/css/pagination'
declare module 'swiper/css/navigation'

declare module '#app' {
  interface NuxtApp {
    $socket: import('socket.io-client').Socket
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $socket: import('socket.io-client').Socket
  }
}

export {}
