import { useBaseStore } from '~/stores/base.store'

export default defineNuxtPlugin(async _nuxtApp => {
  const { fetchAllGenre } = useBaseStore()

  await Promise.all([fetchAllGenre()])
})
