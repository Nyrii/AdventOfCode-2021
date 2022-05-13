import axios from 'axios';
import dotenv from 'dotenv';
import { DataProcessor} from '../interfaces';

const env = dotenv.config()
if (env.error || env.parsed === undefined) {
  throw env.error
}

const TOKEN: string = env.parsed['TOKEN'] ?? ''

export const fetchAocInput = async <T>(aocDayId: number, dataProcessor: DataProcessor<T>): Promise<T> => {
  const inputUrl = `https://adventofcode.com/2021/day/${aocDayId}/input`
  return await axios.get(inputUrl, {headers: {cookie: `session=${TOKEN}`}})
    .then(res => res.data)
    .then(rawData => dataProcessor(rawData))
}