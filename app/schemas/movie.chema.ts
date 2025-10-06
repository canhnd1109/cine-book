import { z } from 'zod'

export function createMovieSchema(t: (key: string) => string) {
  return z
    .object({
      director: z.string().min(1, t('director_required')),

      performer: z.string().min(1, t('performer_required')),

      description: z.string().min(1, t('description_required')),

      releaseDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('releaseDate_invalid')
      }),

      closeDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('closeDate_invalid')
      }),

      nation: z.string().min(1, t('nation_required')),

      duration: z.string().min(1, t('duration_positive')),

      note: z.string().optional(),

      price: z.number().nonnegative(t('price_nonnegative')),

      trailerUrl: z.string().min(1, t('trailerUrl_invalid')),

      posterUrl: z
        .instanceof(File)
        .refine(file => file.size > 0, t('poster_required'))
        .refine(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type), t('poster_invalid_format'))
        .nullable(),

      genreIds: z.array(z.string()).nonempty(t('genreIds_nonempty'))
    })
    .refine(data => new Date(data.closeDate) > new Date(data.releaseDate), {
      message: t('closeDate_after_releaseDate'),
      path: ['closeDate']
    })
}

export type ICreateMovie = z.infer<ReturnType<typeof createMovieSchema>>
