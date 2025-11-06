import { cloneDeep, forEach } from 'lodash-es'

export default function normalizedParamss(params: Record<string, any>) {
  const removeKeys = ['loading', 'tabActive', 'total', 'rangePrice']

  if (params) {
    const _params = cloneDeep(params)
    const keys = Object.keys(_params)
    forEach(keys, key => {
      // trim search
      if (key === 'search') {
        _params[key] = _params[key].trim()
      }
      // remove empty value

      if (!_params[key] || _params[key] === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete _params[key]
      }

      // remove key loading
      if (removeKeys.includes(key)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete _params[key]
      }
    })
    return _params
  }
  return params
}
