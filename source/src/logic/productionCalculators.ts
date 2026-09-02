export function targetOutput(targetEfficiency: number, workers: number, hours: number, sam: number) {
  if (![targetEfficiency, workers, hours, sam].every(value => Number.isFinite(value) && value > 0)) return null
  return (targetEfficiency / 100) * workers * hours * 60 / sam
}

export function theoreticalPeople(target: number, sam: number, hours: number, targetEfficiency: number) {
  if (![target, sam, hours, targetEfficiency].every(value => Number.isFinite(value) && value > 0)) return null
  return target * sam / (60 * hours * (targetEfficiency / 100))
}

export function achievement(actual: number, target: number) {
  if (![actual, target].every(value => Number.isFinite(value) && value >= 0) || target === 0) return null
  return actual / target * 100
}

export function reverseAchievement(target: number, rate: number) {
  if (![target, rate].every(value => Number.isFinite(value) && value >= 0) || target === 0) return null
  return target * rate / 100
}

export function capacityByCt(ct: number, efficiency: number, hours?: number | null) {
  if (!Number.isFinite(ct) || ct <= 0) return null
  const hourly = 3600 / ct * efficiency
  return { hourly, total: hours != null && Number.isFinite(hours) && hours > 0 ? hourly * hours : null }
}

export function taktFromHourlyTarget(target: number) {
  if (!Number.isFinite(target) || target <= 0) return null
  return { hourlyTarget: target, takt: 3600 / target }
}

export function taktFromDailyTarget(target: number, hours: number) {
  if (![target, hours].every(value => Number.isFinite(value) && value > 0)) return null
  const hourlyTarget = target / hours
  return { hourlyTarget, takt: 3600 / hourlyTarget }
}

export function lineBalance(tct: number, processCount: number, maxCt: number) {
  if (![tct, processCount, maxCt].every(value => Number.isFinite(value) && value > 0) || !Number.isInteger(processCount)) return null
  return tct / (processCount * maxCt) * 100
}

export function displayNumber(value: number, digits = 1) {
  return value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}
