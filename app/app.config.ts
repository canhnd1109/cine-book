export default defineAppConfig({
  repository: 'nuxt/ui',
  title: 'CineBook – Đặt Vé Xem Phim Trực Tuyến Nhanh Chóng & Tiện Lợi',
  baseUrl: 'https://cinebookmovie.vercel.app',
  description: 'app.description',
  pages: {
    home: {
      path: '/',
      name: 'Home'
    },
    admin: {
      path: '/admin',
      name: 'Admin'
    },
    movies: {
      name: 'Movies',
      path: '/admin/movies'
    },
    cinemas: {
      name: 'Cinemas',
      icon: 'cinema',
      path: '/admin/cinemas'
    },
    'admin-cinemas-id': {
      name: 'CinemaDetail',
      icon: 'cinema',
      path: '/admin/cinemas/:id'
    },
    'not-found': {
      path: '/:pathMatch(.*)*',
      title: 'Page Not Found'
    }
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    prose: {
      li: {
        base: 'break-words'
      },
      a: {
        base: 'break-words'
      }
    }
  }
})
