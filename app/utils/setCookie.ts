import Cookies from 'js-cookie'

export function setCookie(name: string, value: string, days: number) {
  if (import.meta.client) {
    Cookies.set(name, value, { expires: days, sameSite: 'Lax' })
  }
}
