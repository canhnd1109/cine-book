import { z } from 'zod'

export function createMovieSchema(t: (key: string) => string) {
  return z
    .object({
      name: z.string().min(1, t('name-movie-required')),
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
      duration: z.string().min(1, t('duration-required')),
      note: z.string().optional(),

      price: z
        .any()
        .refine(val => val !== undefined && val !== null && val !== '', { message: t('price-required') })
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: t('price-invalid') })
        .refine(val => val >= 0, { message: t('price-nonnegative') }),

      trailerUrl: z.string().min(1, t('trailer-url-required')),

      posterFile: z
        .instanceof(File, {
          message: t('please-select-poster-image')
        })
        .refine(file => file.size <= 5 * 1024 * 1024, t('iamge-size-must-not-exceed-5mb'))
        .refine(
          file => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
          t('only-accept-image-formats-jpeg-png-gif-webp')
        )
        .nullable(),
      genreIds: z.array(z.string()).nonempty(t('genre-ids-nonempty'))
    })
    .refine(data => new Date(data.closeDate) > new Date(data.releaseDate), {
      message: t('close-date-after-release-date'),
      path: ['closeDate']
    })
}

export type ICreateMovie = z.infer<ReturnType<typeof createMovieSchema>>
