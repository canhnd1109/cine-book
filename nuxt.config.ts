// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc', '@nuxtjs/i18n'],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Nuxt i18n App',
      meta: [{ name: 'description', content: 'Nuxt 3 app with i18n support' }]
    }
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css', 'javascript', 'json'],
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      }
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
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  build: {
    transpile: ['@nuxtjs/i18n']
  },

  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/blog/**': { isr: 60 }
  },

  experimental: {
    payloadExtraction: false,
    typedPages: true
  },

  compatibilityDate: '2025-01-15',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;'
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        indent: 2,
        quotes: 'single',
        semi: false
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
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
      cookieSecure: true,
      cookieCrossOrigin: false
    },
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
})
