// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc', '@nuxtjs/i18n', '@nuxt/image', 'nuxt-security'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi',
      meta: [{ name: 'description', content: 'Nuxt app with internationalization' }]
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
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/': { ssr: false },
    '/api/**': { cors: true },
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        semi: false,
        quotes: 'single'
      }
    }
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
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
      cookieCrossOrigin: false,
      cookieSecure: true
    },
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      // contentSecurityPolicy: {
      //   'default-src': ['\'self\''],
      //   'img-src': ['\'self\'', 'data:', 'https:'],
      //   'script-src': ['\'self\''],
      //   'style-src': ['\'self\'', '\'unsafe-inline\'']
      // }
      contentSecurityPolicy: false
    },
    csrf: true,
    corsHandler: {
      origin: '*'
    }
  }
})
