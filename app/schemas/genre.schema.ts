import { z } from 'zod'

export function addGenre(t: (key: string) => string) {
  return z.object({
    genreName: z
      .string()
      .refine(val => typeof val === 'string', {
        message: t('genre-name-invalid')
      })
      .nonempty(t('genre-name-required'))
  })
}

export type IFormGenre = z.infer<ReturnType<typeof addGenre>>
