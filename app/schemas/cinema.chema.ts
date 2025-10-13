import { z } from 'zod'
import { ACCEPTED_IMAGE_TYPES, MAX_SIZE_IMAGE_UPLOAD, PHONE_NUMBER_REGEX } from '~/constants'

export function createCinemaSchema(t: (key: string, params?: Record<string, any>) => string) {
  return z.object({
    name: z
      .string()
      .min(1, { message: t('name-required') })
      .max(255, { message: t('text-max-length') }),

    province: z.string().min(1, { message: t('province-required') }),

    commune: z.string().min(1, { message: t('commune-required') }),

    detailAddress: z
      .string()
      .min(1, { message: t('detail-address-required') })
      .max(500, { message: t('text-max-length') }),

    phone: z.string().regex(PHONE_NUMBER_REGEX, { message: t('phone-invalid') }),

    description: z.string().optional(),

    files: z
      .array(
        z
          .instanceof(File)
          .refine(file => file.size <= MAX_SIZE_IMAGE_UPLOAD, {
            message: t('files.maxSize', { size: '5MB' })
          })
          .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: t('files.invalidType')
          })
      )
      .min(1, { message: t('files.required') })
      .max(5, { message: t('files.maxLength', { count: 5 }) })
  })
}

export type IFormCinema = z.infer<ReturnType<typeof createCinemaSchema>>
