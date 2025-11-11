import { z } from 'zod'
import { PASSWORD_REGEX, PHONE_NUMBER_REGEX } from '~/constants'

export function signUpSchema(t: (key: string) => string) {
  return z
    .object({
      firstName: z.string().min(1, t('auth.first-name-is-required')),
      lastName: z.string().min(1, t('auth.last-name-is-required')),
      phone: z.string().min(1, t('auth.phone-number-is-required')).regex(PHONE_NUMBER_REGEX, t('auth.phone-number-invalid')),
      email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email')),
      password: z.string().regex(PASSWORD_REGEX, {
        message: t('auth.password-must-be-at-least-8-characters-include-uppercase-lowercase-number-and-special-character')
      }),
      confirmPassword: z.string().min(1, t('auth.confirm-password-is-required'))
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth.passwords-do-not-match')
    })
}

export function signInSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email')),
    password: z.string().regex(PASSWORD_REGEX, {
      message: t('auth.password-must-be-at-least-8-characters-include-uppercase-lowercase-number-and-special-character')
    })
  })
}

export function updateProfileSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t('auth.first-name-is-required')),
    lastName: z.string().min(1, t('auth.last-name-is-required')),
    phone: z.string().min(1, t('auth.phone-number-is-required')).regex(PHONE_NUMBER_REGEX, t('auth.phone-number-invalid')),
    email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email'))
  })
}
export function emailSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email'))
  })
}

// Types
export type IFormSignUp = z.infer<ReturnType<typeof signUpSchema>>
export type IFormSignIn = z.infer<ReturnType<typeof signInSchema>>
export type IFormUpdateProfile = z.infer<ReturnType<typeof updateProfileSchema>>
export type IFormEmail = z.infer<ReturnType<typeof emailSchema>>
