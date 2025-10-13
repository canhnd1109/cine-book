export interface IBaseProvince {
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
}
export interface IProvince extends IBaseProvince {
  map(arg0: (p: any) => any): any
  wards: []
}

export interface IWard {
  name: string
  code: number
  division_type: string
  codename: string
  province_code: number
}
export interface IWardOfProvince extends IBaseProvince {
  wards: IWard[]
}
