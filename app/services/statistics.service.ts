import type { IResponseData } from '~/types/response.type'
import BaseService from './base.service'
import type { IStatisticsSummary } from '~/types/statistics.type'

export class StatisticsService extends BaseService {
  constructor() {
    super('statistics')
  }

  async getSummary(): Promise<IResponseData<IStatisticsSummary>> {
    return this.get<IResponseData<IStatisticsSummary>>('')
  }
}
