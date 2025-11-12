// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxtjs/i18n',
    '@nuxt/image',
    'nuxt-security',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  ssr: true,

  devtools: {
    enabled: true
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      title: 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi',
      meta: [
        {
          name: 'description',
          content:
            'Đặt vé xem phim online dễ dàng tại CineBook. Hệ thống rạp chiếu phim hiện đại, giá vé ưu đãi, thanh toán an toàn. Trải nghiệm điện ảnh tuyệt vời!'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#1a1a1a' },
        { name: 'msapplication-TileColor', content: '#1a1a1a' },
        {
          name: 'keywords',
          content:
            'đặt vé xem phim, rạp chiếu phim, vé phim online, CineBook, cinema booking, movie tickets, phim mới, lịch chiếu phim'
        },
        { name: 'author', content: 'CineBook' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'geo.region', content: 'VN' },
        { name: 'geo.country', content: 'Vietnam' },
        { name: 'application-name', content: 'CineBook' },
        { name: 'apple-mobile-web-app-title', content: 'CineBook' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }]
    }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      defaultVariants: {
        color: 'neutral'
      }
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    public: {
      baseApiUrl: process.env.NUXT_PUBLIC_BASE_API_URL || 'http://localhost:8080',
      baseApiUrlLocation: process.env.NUXT_PUBLIC_BASE_API_LOCATION || 'https://provinces.open-api.vn/api/v2',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://cinebookmovie.vercel.app',
      siteName: 'CineBook',
      siteDescription: 'Đặt vé xem phim online dễ dàng tại CineBook'
    }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    viewTransition: true,
    headNext: true,
    emitRouteChunkError: 'automatic'
  },

  compatibilityDate: '2025-01-15',
  vite: {
    plugins: [svgLoader()]
  },
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr'
      },
      {
        code: 'vi',
        iso: 'vi-VN',
        name: 'Tiếng Việt',
        file: 'vi.json',
        dir: 'ltr'
      }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'vi',
      cookieCrossOrigin: false,
      cookieSecure: true
    },
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    pages: {
      about: {
        en: '/about',
        vi: '/gioi-thieu'
      },
      contact: {
        en: '/contact',
        vi: '/lien-he'
      }
    }
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? 'credentialless' : false,
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'https:', 'http:', '*'],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'http:', '*'],
        'style-src': ["'self'", "'unsafe-inline'", 'https:', 'http:', '*'],
        'font-src': ["'self'", 'https:', 'http:', 'data:', '*'],
        'connect-src': ["'self'", 'https:', 'http:', 'wss:', 'ws:', '*'],
        'frame-src': ["'self'", 'https:', 'http:', '*'],
        'media-src': ["'self'", 'https:', 'http:', 'data:', '*'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': process.env.NODE_ENV === 'production'
      },
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'cross-origin',
      referrerPolicy: 'strict-origin-when-cross-origin',
      strictTransportSecurity: {
        maxAge: 63072000,
        includeSubdomains: true,
        preload: true
      },
      xContentTypeOptions: 'nosniff',
      xDNSPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'DENY',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '1; mode=block',
      permissionsPolicy: false
    },
    csrf: {
      enabled: true,
      https: process.env.NODE_ENV === 'production',
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    corsHandler: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'App-Code', 'Accept']
    },
    rateLimiter: {
      tokensPerInterval: 100,
      interval: 300000,
      headers: false,
      driver: {
        name: 'memory'
      },
      throwError: true
    },
    allowedMethodsRestricter: {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    hidePoweredBy: true,
    basicAuth: false,
    enabled: process.env.NODE_ENV === 'production'
  }
})
