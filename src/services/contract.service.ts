import { BaseApiService } from './base-api.service'
import { authenticatedAxios } from './api.service'
import { CONTRACT_URLS } from '../constants/contractUrl.constant'
import type {
    CreateContractDto,
    UpdateContractDto,
    ContractOutDto
} from '../types/contract.types'

export class ContractService extends BaseApiService<
    CreateContractDto,
    UpdateContractDto,
    ContractOutDto
> {
    constructor() {
        super({
            urls: CONTRACT_URLS,
            axiosInstance: authenticatedAxios,
        })
    }
}

export const contractService = new ContractService()
