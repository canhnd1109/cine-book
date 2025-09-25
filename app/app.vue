<script setup lang="ts">
const appConfig = useAppConfig()
const { t, locale } = useI18n()
const route = useRoute()

const canonicalUrl = `${appConfig.baseUrl || 'https://cinebookmovie.vercel.app'}${route.path}`

const pageTitle = 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi'
const pageDescription =
  t(`${appConfig.description}`) ||
  'Đặt vé xem phim online dễ dàng tại CineBook. Hệ thống rạp chiếu phim hiện đại, giá vé ưu đãi, thanh toán an toàn. Trải nghiệm điện ảnh tuyệt vời!'

useHead({
  title: pageTitle,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
    { name: 'format-detection', content: 'telephone=no' },

    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'đặt vé xem phim, rạp chiếu phim, vé phim online, CineBook, cinema booking, movie tickets' },
    { name: 'author', content: 'CineBook' },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'CineBook' },
    { property: 'og:locale', content: locale.value === 'vi' ? 'vi_VN' : 'en_US' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image:alt', content: 'CineBook - Đặt vé xem phim trực tuyến' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@cinebook' },
    { name: 'twitter:creator', content: '@cinebook' },

    { name: 'theme-color', content: '#1a1a1a' },
    { name: 'msapplication-TileColor', content: '#1a1a1a' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

    { name: 'geo.region', content: 'VN' },
    { name: 'geo.country', content: 'Vietnam' },

    { name: 'application-name', content: 'CineBook' },
    { name: 'apple-mobile-web-app-title', content: 'CineBook' }
  ],

  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'canonical', href: canonicalUrl },

    // Preconnect to external domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

    // DNS prefetch for performance
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' }
  ],

  htmlAttrs: {
    lang: locale.value || 'vi',
    dir: 'ltr'
  },

  bodyAttrs: {
    class: 'antialiased'
  },

  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CineBook',
        url: canonicalUrl,
        logo: '/logo.png',
        description: pageDescription,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84-0395279591',
          contactType: 'customer service',
          availableLanguage: ['Vietnamese', 'English']
        }
        // 'sameAs': [
        //   'https://facebook.com/cinebook',
        //   'https://instagram.com/cinebook',
        //   'https://twitter.com/cinebook'
        // ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CineBook',
        url: canonicalUrl,
        description: pageDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${canonicalUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})

// SEO Meta
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage keep-alive />
    </NuxtLayout>
  </UApp>
</template>
