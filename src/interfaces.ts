export interface DataProcessor<T> {
  (value: string): Promise<T>
}
