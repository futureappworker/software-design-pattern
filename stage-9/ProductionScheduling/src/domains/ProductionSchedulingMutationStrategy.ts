import { nanoid } from 'nanoid'
import type {
  Gene,
  MutationStrategy,
  Population as PopulationType,
} from '../../../GeneticAlgorithm/src'
import { Individual, Population } from '../../../GeneticAlgorithm/src'
import type { Company } from './Company'
import { ProductionSchedulingGene } from './ProductionSchedulingGene'

export class ProductionSchedulingMutationStrategy implements MutationStrategy {
  private company: Company
  private mutationRate: number

  constructor({
    company,
    mutationRate = 0.3,
  }: {
    company: Company
    mutationRate?: number
  }) {
    this.company = company
    this.mutationRate = mutationRate
  }

  perform(population: PopulationType): Population {
    // 變異時仍綁定「機器 i + 工人 i」產線槽，避免隨機配對造成無法並行
    const machineIds = this.company.getMachineIds()
    const workerIds = this.company.getWorkerIds()
    const parallelSlots = Math.min(machineIds.length, workerIds.length)

    const mutatedIndividuals = population.getIndividuals().map((individual) => {
      const genes: Gene[] = []

      for (const gene of individual.getGenes()) {
        if (!(gene instanceof ProductionSchedulingGene)) {
          genes.push(gene)
          continue
        }

        // 切開大任務到不同產線槽
        if (
          parallelSlots > 1 &&
          gene.getQuantity() > 1 &&
          Math.random() < this.mutationRate
        ) {
          const splitQuantity =
            Math.floor(Math.random() * (gene.getQuantity() - 1)) + 1
          const slot1 = Math.floor(Math.random() * parallelSlots)
          let slot2 = Math.floor(Math.random() * parallelSlots)
          while (slot2 === slot1 && parallelSlots > 1) {
            slot2 = Math.floor(Math.random() * parallelSlots)
          }

          genes.push(
            new ProductionSchedulingGene({
              id: nanoid(),
              productId: gene.getProductId(),
              machineId: machineIds[slot1],
              workerId: workerIds[slot1],
              quantity: splitQuantity,
            }),
            new ProductionSchedulingGene({
              id: nanoid(),
              productId: gene.getProductId(),
              machineId: machineIds[slot2],
              workerId: workerIds[slot2],
              quantity: gene.getQuantity() - splitQuantity,
            }),
          )
          continue
        }

        if (Math.random() >= this.mutationRate) {
          genes.push(gene)
          continue
        }

        const slot = Math.floor(Math.random() * parallelSlots)
        genes.push(
          new ProductionSchedulingGene({
            id: nanoid(),
            productId: gene.getProductId(),
            machineId: machineIds[slot],
            workerId: workerIds[slot],
            quantity: gene.getQuantity(),
          }),
        )
      }

      if (genes.length >= 2 && Math.random() < this.mutationRate) {
        const index1 = Math.floor(Math.random() * genes.length)
        let index2 = Math.floor(Math.random() * genes.length)

        while (index2 === index1) {
          index2 = Math.floor(Math.random() * genes.length)
        }

        ;[genes[index1], genes[index2]] = [genes[index2], genes[index1]]
      }

      return new Individual({
        genes,
        fitnessEvaluator: individual.getFitnessEvaluator(),
      })
    })

    return new Population({
      individuals: mutatedIndividuals,
    })
  }
}
