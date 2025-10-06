import { z } from 'zod'

export function createMovieSchema(t: (key: string) => string) {
  return z
    .object({
      director: z.string().min(1, t('director-required')),

      performer: z.string().min(1, t('performer-required')),

      description: z.string().min(1, t('description-required')),

      releaseDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('release-date-invalid')
      }),

      closeDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: t('close-date-invalid')
      }),

      nation: z.string().min(1, t('nation-required')),

      duration: z.string().min(1, t('duration-positive')),

      note: z.string().optional(),

      price: z.number().nonnegative(t('price-nonnegative')),

      trailerUrl: z.string().min(1, t('trailerUrl-invalid')),

      posterUrl: z
        .instanceof(File)
        .refine(file => file.size > 0, t('trailer-required'))
        .refine(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type), t('triler-invalid-format'))
        .nullable(),

      genreIds: z.array(z.string()).nonempty(t('genre-ids-nonempty'))
    })
    .refine(data => new Date(data.closeDate) > new Date(data.releaseDate), {
      message: t('close-date-after-release-date'),
      path: ['closeDate']
    })
}

export type ICreateMovie = z.infer<ReturnType<typeof createMovieSchema>>
