import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export interface ExtendedFetchOptions<T extends NitroFetchRequest = NitroFetchRequest>
  extends NitroFetchOptions<T> {
  _retry?: boolean
}
