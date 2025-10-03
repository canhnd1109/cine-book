import type { IGenreFilter } from '~/types/genre.type'

export const useGenreFilterSync = createFilterSync<IGenreFilter>({
  defaults: {
    search: ''
  },
  mapping: {
    search: 'search'
  },
  coerce: {
    search: 'string'
  },
  debounceMs: 400
})
