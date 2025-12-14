import type { IResponseData } from '~/types/response.type'
import BaseService from './base.service'
import type { IRevenueReport, IRevenueReportParams } from '~/types/statistics.type'

export class ReportService extends BaseService {
  constructor() {
    super('report')
  }

  async getRevenueReport(params: IRevenueReportParams): Promise<IResponseData<IRevenueReport[]>> {
    return this.get<IResponseData<IRevenueReport[]>>('/price', normalizedParams(params))
  }
  async getRevenueBooking(params: IRevenueReportParams): Promise<IResponseData<IRevenueReport[]>> {
    return this.get<IResponseData<IRevenueReport[]>>('/booking', normalizedParams(params))
  }
}
