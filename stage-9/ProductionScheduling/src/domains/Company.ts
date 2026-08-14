type CompanyConfig = {
  machineIds: string[]
  workerIds: string[]
  requiredQuantityMap: Map<string, number>
}

export class Company {
  private machineIds: string[] = []
  private workerIds: string[] = []
  // 公司需求的產品數量
  // Map<productName, number>
  private requiredQuantityMap: Map<string, number> = new Map()

  constructor({ machineIds, workerIds, requiredQuantityMap }: CompanyConfig) {
    this.machineIds = [...machineIds]
    this.workerIds = [...workerIds]
    this.requiredQuantityMap = requiredQuantityMap
  }

  getMachineIds(): string[] {
    return [...this.machineIds]
  }

  getWorkerIds(): string[] {
    return [...this.workerIds]
  }

  getRequiredQuantityMap(): Map<string, number> {
    return new Map([...this.requiredQuantityMap])
  }
}
