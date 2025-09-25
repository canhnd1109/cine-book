// server/api/movies.ts
export default cachedEventHandler(
  async (event) => {
    const query = getQuery(event)

    return await $fetch('http://localhost:8080/movies', {
      query
    })
  },
  {
    maxAge: 300, // cache 5 phút
    swr: true
  }
)


// const page = ref(1)
// const size = ref(10)
// const genre = ref('action')

// const { data: movies, pending, refresh } = await useAsyncData(
//   () => ['movies', page.value, size.value, genre.value], // key dynamic
//   () => $fetch('/api/movies', {
//     query: { page: page.value, size: size.value, genre: genre.value }
//   }),
//   {
//     watch: [page, size, genre], // khi params đổi thì fetch lại
//     default: () => ({ content: [], totalPages: 0 })
//   }
// )
