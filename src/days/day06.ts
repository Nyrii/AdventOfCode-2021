import {DataProcessor} from '../interfaces';
import {fetchAocInput} from '../services/aoc.service.js';

const AGE_RESET = 6
const NEW_FISH_AGE = 8

/** The representation of a lantern fish. */
interface LanternFish {
  timer: number
}

const lanternFishProcessor: DataProcessor<LanternFish[]> = (value: string) => {
  const lanternFishes: LanternFish[] = value.split(',').map(v => ({ timer: Number(v) } as LanternFish))
  if (lanternFishes.length === 0) {
    return Promise.reject(new Error('Input for Day 6 failed to be mapped'))
  }
  return Promise.resolve(lanternFishes)
}

const simulateLanternFishGrowth = (lanternFishes: LanternFish[], days: number): Promise<number> => {
  if (days < 0) {
    return Promise.reject(new Error(`The growth cannot be simulated, days is '${days}'; should be greater or equal than 0`))
  }
  let fishes = Array(9).fill(0)
  for (let lanternFish of lanternFishes) {
    fishes[lanternFish.timer] = fishes[lanternFish.timer] + 1
  }
  for (let i = 0; i < days; i++) {
    fishes.push(fishes.shift())
    fishes[AGE_RESET] += fishes[NEW_FISH_AGE]
  }
  return Promise.resolve(fishes.reduce((totalCount, fishCount) => totalCount + fishCount))
}

const simulate = (days: number): void => {
  fetchAocInput(6, lanternFishProcessor)
    .then(lanternFishes => simulateLanternFishGrowth(lanternFishes, days))
    .then(numberOfFishes => console.log(`Number of fishes after ${days} days: ${numberOfFishes}`))
    .catch(err => console.error('Unable to run the simulation', err))
}

// Result: 362666
simulate(80)

// Result: 1640526601595
simulate(256)