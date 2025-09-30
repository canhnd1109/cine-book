// https://nuxt.com/docs/api/configuration/nuxt-config
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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: '//images.unsplash.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css', 'javascript', 'json', 'bash']
    },
    remarkPlugins: {
      'remark-github': {
        options: {
          repository: 'nuxt-ui-templates/changelog'
        }
      }
    }
  },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'CineBook',
      siteDescription: 'Đặt vé xem phim online dễ dàng tại CineBook'
    }
  },

  routeRules: {
    '/': {
      ssr: true,
      headers: {
        'cache-control': 's-maxage=31536000',
        'x-robots-tag': 'index, follow'
      }
    }
    // '/api/**': {
    //   cors: true,
    //   headers: {
    //     'cache-control': 'max-age=300',
    //     'x-robots-tag': 'noindex'
    //   }
    // },
    // '/admin/**': {
    //   ssr: false,
    //   headers: {
    //     'x-robots-tag': 'noindex, nofollow'
    //   }
    // },
    // '/movies/**': {
    //   ssr: true,
    //   headers: {
    //     'cache-control': 's-maxage=3600',
    //     'x-robots-tag': 'index, follow'
    //   }
    // },
    // '/theaters/**': {
    //   ssr: true,
    //   headers: {
    //     'cache-control': 's-maxage=7200',
    //     'x-robots-tag': 'index, follow'
    //   }
    // },
    // '/static/**': {
    //   headers: {
    //     'cache-control': 'max-age=31536000, immutable'
    //   }
    // },
    // '/sitemap.xml': {
    //   prerender: true,
    //   headers: {
    //     'cache-control': 'max-age=86400'
    //   }
    // },
    // '/robots.txt': {
    //   prerender: true,
    //   headers: {
    //     'cache-control': 'max-age=86400'
    //   }
    // },
    // '/search': {
    //   ssr: false
    // },
    // '/booking/**': {
    //   ssr: false
    // }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    viewTransition: true,
    headNext: true,
    emitRouteChunkError: 'automatic'
  },

  compatibilityDate: '2025-01-15',

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
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:8080',
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
      crossOriginEmbedderPolicy: false,
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
        'upgrade-insecure-requests': true
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
      permissionsPolicy: {
        camera: ["'none'"],
        microphone: ["'none'"],
        geolocation: ["'self'"],
        payment: ["'self'"],
        usb: ["'none'"],
        bluetooth: ["'none'"]
      }
    },
    csrf: {
      enabled: true,
      https: process.env.NODE_ENV === 'production',
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    corsHandler: {
      origin:
        process.env.NODE_ENV === 'production'
          ? [...(process.env.NUXT_PUBLIC_SITE_URL ? [process.env.NUXT_PUBLIC_SITE_URL] : []), 'https://cinebookmovie.vercel.app']
          : '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
