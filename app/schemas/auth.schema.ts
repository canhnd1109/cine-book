import { z } from 'zod'

const passwordRegex
  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const phoneNumberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g

export function createSignUpSchema(t: (key: string) => string) {
  return z
    .object({
      firstName: z.string().min(1, t('auth.first-name-is-required')),
      lastName: z.string().min(1, t('auth.last-name-is-required')),
      phone: z
        .string()
        .min(1, t('auth.phone-number-is-required'))
        .regex(phoneNumberRegex, t('auth.phone-number-invalid')),
      email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email')),
      password: z.string().regex(passwordRegex, {
        message: t(
          'auth.password-must-be-at-least-8-characters-include-uppercase-lowercase-number-and-special-character'
        )
      }),
      // confirmPassword: z.string().min(1, t('auth.confirm-password-is-required'))
    })
    // .refine(data => data.password === data.confirmPassword, {
    //   path: ['confirmPassword'],
    //   message: t('auth.passwords-do-not-match')
    // })
}

export function createSignInSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().min(1, t('auth.email-is-required')).email(t('auth.invalid-email')),
    password: z.string().regex(passwordRegex, {
      message: t(
        'auth.password-must-be-at-least-8-characters-include-uppercase-lowercase-number-and-special-character'
      )
    })
  })
}

// Types
export type IFormSignUp = z.infer<ReturnType<typeof createSignUpSchema>>
export type IFormSignIn = z.infer<ReturnType<typeof createSignInSchema>>
