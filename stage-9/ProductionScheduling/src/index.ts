import { nanoid } from 'nanoid'
import {
  FindBestIndividual,
  GeneticAlgorithm,
  GeneticAlgorithmFactory,
  IndividualComparator,
  RankSelectionStrategy,
  TerminationCondition,
} from '../../GeneticAlgorithm/src'
import { Company } from './domains/Company'
import { Machine } from './domains/Machine'
import { ProductionSchedulingCreateInitialPopulation } from './domains/ProductionSchedulingCreateInitialPopulation'
import { ProductionSchedulingCrossoverStrategy } from './domains/ProductionSchedulingCrossoverStrategy'
import { ProductionSchedulingFitnessEvaluator } from './domains/ProductionSchedulingFitnessEvaluator'
import { ProductionSchedulingGene } from './domains/ProductionSchedulingGene'
import { ProductionSchedulingMutationStrategy } from './domains/ProductionSchedulingMutationStrategy'
import { ProductionSchedulingProduct } from './domains/ProductionSchedulingProduct'
import { Worker } from './domains/Worker'

// 需要生產 3 種產品：產品 A、產品 B 和產品 C
// 它們需要的生產時間分別為 2 小時、4 小時和 6 小時
const products: ProductionSchedulingProduct[] = [
  new ProductionSchedulingProduct({
    id: nanoid(),
    name: 'Product A',
    productionTime: 2,
  }),
  new ProductionSchedulingProduct({
    id: nanoid(),
    name: 'Product B',
    productionTime: 4,
  }),
  new ProductionSchedulingProduct({
    id: nanoid(),
    name: 'Product C',
    productionTime: 6,
  }),
]

const machines: Machine[] = [new Machine(), new Machine()]

const workers: Worker[] = [
  new Worker(),
  new Worker(),
  new Worker(),
  new Worker(),
]

// 產品 A：需要生產 100 個。
// 產品 B：需要生產 200 個。
// 產品 C：需要生產 300 個。
const company: Company = new Company({
  machineIds: machines.map((machine) => machine.getId()),
  workerIds: workers.map((worker) => worker.getId()),
  requiredQuantityMap: new Map([
    ['Product A', 100],
    ['Product B', 200],
    ['Product C', 300],
  ]),
})

const fitnessEvaluator = new ProductionSchedulingFitnessEvaluator({
  products,
  company,
})

// 每個產品都需要使用一台機器和一名工人才能生產，
// 並且每台機器和每名工人一次只能處理一個產品
// 需要在最短的時間內生產所需的產品數量，並滿足以下客戶需求
const productionSchedulingCreateInitialPopulation =
  new ProductionSchedulingCreateInitialPopulation({
    company,
    products,
    fitnessEvaluator,
  })

const geneticAlgorithm = new GeneticAlgorithm({
  geneticAlgorithmFactory: new GeneticAlgorithmFactory({
    createInitialPopulationFactory: productionSchedulingCreateInitialPopulation,
    selectionStrategy: new RankSelectionStrategy({
      individualComparator: new IndividualComparator(),
    }),
    crossoverStrategy: new ProductionSchedulingCrossoverStrategy(),
    mutationStrategy: new ProductionSchedulingMutationStrategy({ company }),
    terminationCondition: new TerminationCondition(),
    findBestIndividual: new FindBestIndividual(),
  }),
})

const bestIndividual = geneticAlgorithm.run()
const schedule = fitnessEvaluator.buildSchedule(bestIndividual.getGenes())

schedule.tasks.forEach((task) => {
  const { gene, productName, startTime, endTime, duration } = task

  console.log(
    `${productName} machine=${gene.getMachineId()} worker=${gene.getWorkerId()} qty=${gene.getQuantity()} start=${startTime} end=${endTime} duration=${duration}`,
  )
})

function hasOverlap(
  a: { startTime: number; endTime: number },
  b: { startTime: number; endTime: number },
): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime
}

const tasksByWorker = new Map<string, typeof schedule.tasks>()
const tasksByMachine = new Map<string, typeof schedule.tasks>()

for (const task of schedule.tasks) {
  const workerId = task.gene.getWorkerId()
  const machineId = task.gene.getMachineId()

  tasksByWorker.set(workerId, [...(tasksByWorker.get(workerId) ?? []), task])
  tasksByMachine.set(machineId, [
    ...(tasksByMachine.get(machineId) ?? []),
    task,
  ])
}

let workerOverlapCount = 0
for (const [workerId, tasks] of tasksByWorker) {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (hasOverlap(tasks[i], tasks[j])) {
        workerOverlapCount += 1
        console.log(
          `工人重疊: ${workerId} [${tasks[i].startTime},${tasks[i].endTime}) vs [${tasks[j].startTime},${tasks[j].endTime})`,
        )
      }
    }
  }
}

let machineOverlapCount = 0
for (const [machineId, tasks] of tasksByMachine) {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (hasOverlap(tasks[i], tasks[j])) {
        machineOverlapCount += 1
        console.log(
          `機器重疊: ${machineId} [${tasks[i].startTime},${tasks[i].endTime}) vs [${tasks[j].startTime},${tasks[j].endTime})`,
        )
      }
    }
  }
}

console.log(
  `工人同時重疊次數: ${workerOverlapCount}（0 表示同一時間沒有工人出現兩次）`,
)
console.log(
  `機器同時重疊次數: ${machineOverlapCount}（0 表示同一時間沒有機器處理兩件）`,
)

console.log(`花費時間: ${schedule.makespan} 小時（考量機器/工人並行）`)

const producedQuantityByProductName = new Map<string, number>()
for (const gene of bestIndividual.getGenes()) {
  if (!(gene instanceof ProductionSchedulingGene)) {
    continue
  }

  const product = fitnessEvaluator.getProductById(gene.getProductId())
  if (!product) {
    continue
  }

  producedQuantityByProductName.set(
    product.getName(),
    (producedQuantityByProductName.get(product.getName()) ?? 0) +
      gene.getQuantity(),
  )
}

console.log('fitness:', bestIndividual.getFitness())
console.log('required:', Object.fromEntries(company.getRequiredQuantityMap()))
console.log('produced:', Object.fromEntries(producedQuantityByProductName))
