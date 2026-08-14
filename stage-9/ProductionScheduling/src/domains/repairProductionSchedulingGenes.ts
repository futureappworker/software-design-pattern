import { nanoid } from 'nanoid'
import type { Company } from './Company'
import { ProductionSchedulingGene } from './ProductionSchedulingGene'
import type { ProductionSchedulingProduct } from './ProductionSchedulingProduct'

type RepairProductionSchedulingGenesConfig = {
  genes: ProductionSchedulingGene[]
  products: ProductionSchedulingProduct[]
  company: Company
}

function splitAcrossParallelSlots({
  productId,
  requiredQuantity,
  company,
}: {
  productId: string
  requiredQuantity: number
  company: Company
}): ProductionSchedulingGene[] {
  const machineIds = company.getMachineIds()
  const workerIds = company.getWorkerIds()
  const parallelSlots = Math.min(machineIds.length, workerIds.length)
  const base = Math.floor(requiredQuantity / parallelSlots)
  let remainder = requiredQuantity % parallelSlots
  const genes: ProductionSchedulingGene[] = []

  for (let i = 0; i < parallelSlots; i++) {
    const extra = remainder > 0 ? 1 : 0
    if (remainder > 0) {
      remainder -= 1
    }
    const quantity = base + extra

    if (quantity <= 0) {
      continue
    }

    genes.push(
      new ProductionSchedulingGene({
        id: nanoid(),
        productId,
        machineId: machineIds[i],
        workerId: workerIds[i],
        quantity,
      }),
    )
  }

  return genes
}

function bindToParallelSlot({
  gene,
  company,
}: {
  gene: ProductionSchedulingGene
  company: Company
}): ProductionSchedulingGene {
  const machineIds = company.getMachineIds()
  const workerIds = company.getWorkerIds()
  const parallelSlots = Math.min(machineIds.length, workerIds.length)

  let slot = machineIds.indexOf(gene.getMachineId())
  if (slot < 0 || slot >= parallelSlots) {
    slot = Math.floor(Math.random() * parallelSlots)
  }

  return new ProductionSchedulingGene({
    id: gene.getId(),
    productId: gene.getProductId(),
    machineId: machineIds[slot],
    workerId: workerIds[slot],
    quantity: gene.getQuantity(),
  })
}

export function repairProductionSchedulingGenes({
  genes,
  products,
  company,
}: RepairProductionSchedulingGenesConfig): ProductionSchedulingGene[] {
  const repairedGenes: ProductionSchedulingGene[] = []

  for (const [
    productName,
    requiredQuantity,
  ] of company.getRequiredQuantityMap()) {
    const product = products.find(
      (candidate) => candidate.getName() === productName,
    )

    if (!product) {
      continue
    }

    const productGenes = genes.filter(
      (gene) => gene.getProductId() === product.getId(),
    )

    if (productGenes.length === 0) {
      repairedGenes.push(
        ...splitAcrossParallelSlots({
          productId: product.getId(),
          requiredQuantity,
          company,
        }),
      )
      continue
    }

    const currentTotal = productGenes.reduce(
      (sum, gene) => sum + gene.getQuantity(),
      0,
    )

    if (currentTotal === requiredQuantity) {
      repairedGenes.push(
        ...productGenes.map((gene) => bindToParallelSlot({ gene, company })),
      )
      continue
    }

    if (currentTotal <= 0) {
      repairedGenes.push(
        ...splitAcrossParallelSlots({
          productId: product.getId(),
          requiredQuantity,
          company,
        }),
      )
      continue
    }

    let allocated = 0

    productGenes.forEach((gene, index) => {
      const quantity =
        index === productGenes.length - 1
          ? requiredQuantity - allocated
          : Math.floor((gene.getQuantity() / currentTotal) * requiredQuantity)

      allocated += quantity

      if (quantity <= 0) {
        return
      }

      repairedGenes.push(
        bindToParallelSlot({
          gene: new ProductionSchedulingGene({
            id: nanoid(),
            productId: product.getId(),
            machineId: gene.getMachineId(),
            workerId: gene.getWorkerId(),
            quantity,
          }),
          company,
        }),
      )
    })
  }

  return repairedGenes
}
