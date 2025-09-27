import Cookies from 'js-cookie'

export function clearCookie(name: string) {
  if (import.meta.client) {
    Cookies.remove(name)
  }
}
