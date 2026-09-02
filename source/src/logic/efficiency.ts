export interface EfficiencyInput { output: number | null; sam: number | null; workers: number | null; hours: number | null; target: number | null }
export interface EfficiencyResult { valid: boolean; efficiency: number; difference: number | null; achievement: number | null; status: 'good' | 'low' | 'none' }
export function calculateEfficiency(input: EfficiencyInput): EfficiencyResult {
  const values = [input.output, input.sam, input.workers, input.hours]
  if (values.some(value => value === null || !Number.isFinite(value) || value! <= 0)) return { valid: false, efficiency: 0, difference: null, achievement: null, status: 'none' }
  const efficiency = (input.output! * input.sam!) / (input.workers! * input.hours! * 60) * 100
  if (!input.target || input.target <= 0) return { valid: true, efficiency, difference: null, achievement: null, status: 'none' }
  const difference = efficiency - input.target
  const achievement = efficiency / input.target * 100
  return { valid: true, efficiency, difference, achievement, status: achievement >= 100 ? 'good' : 'low' }
}
