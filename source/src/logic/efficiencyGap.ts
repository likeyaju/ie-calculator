export interface EfficiencyGapInput {
  sam: number | null
  workers: number | null
  hours: number | null
  targetEfficiency: number | null
  outputs: number[]
}

export interface EfficiencyGapResult {
  valid: boolean
  totalOutput: number
  actualEfficiency: number
  theoreticalTargetOutput: number
  requiredTotalOutput: number
  remainingPieces: number
  excessPieces: number
  efficiencyDifference: number
  reached: boolean
}

/** Avoid adding a whole piece only because an exact integer has binary floating noise. */
function reliableCeil(value: number) {
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(value)) * 16
  return Math.ceil(value - tolerance)
}

export function calculateEfficiencyGap(input: EfficiencyGapInput): EfficiencyGapResult {
  const totalOutput = input.outputs.reduce((sum, value) => sum + value, 0)
  const baseValues = [input.sam, input.workers, input.hours, input.targetEfficiency]
  const validBase = baseValues.every(value => value !== null && Number.isFinite(value) && value! > 0)
  const validOutputs = input.outputs.length > 0 && input.outputs.every(value => Number.isFinite(value) && value >= 0 && Number.isInteger(value))

  if (!validBase || !validOutputs) {
    return {
      valid: false,
      totalOutput,
      actualEfficiency: 0,
      theoreticalTargetOutput: 0,
      requiredTotalOutput: 0,
      remainingPieces: 0,
      excessPieces: 0,
      efficiencyDifference: 0,
      reached: false,
    }
  }

  const availableMinutes = input.workers! * input.hours! * 60
  const actualEfficiency = totalOutput * input.sam! / availableMinutes * 100
  const theoreticalTargetOutput = availableMinutes * (input.targetEfficiency! / 100) / input.sam!
  const requiredTotalOutput = reliableCeil(theoreticalTargetOutput)
  const remainingPieces = Math.max(0, requiredTotalOutput - totalOutput)
  const excessPieces = Math.max(0, totalOutput - requiredTotalOutput)

  return {
    valid: true,
    totalOutput,
    actualEfficiency,
    theoreticalTargetOutput,
    requiredTotalOutput,
    remainingPieces,
    excessPieces,
    efficiencyDifference: actualEfficiency - input.targetEfficiency!,
    reached: totalOutput >= requiredTotalOutput,
  }
}
