export function average(values: Array<number | null>) {
  const valid = values.filter((v): v is number => v !== null && Number.isFinite(v) && v > 0)
  return valid.length ? valid.reduce((sum, v) => sum + v, 0) / valid.length : null
}
export function diagnose(target: number | null, workers: Array<Array<number | null>>) {
  const averages = workers.map(average).filter((v): v is number => v !== null)
  if (!target || target <= 0 || !averages.length) return null
  const capacity = averages.reduce((sum, ct) => sum + 3600 / ct, 0)
  return { averages, capacity, equivalentCT: 3600 / capacity, targetCT: 3600 / target, gap: capacity - target, reached: capacity >= target }
}
