import assert from 'node:assert/strict'
import { acceptDecimalDraft, isValidDecimalDraft, parseDecimalDraft } from '../src/logic/decimalInput.ts'
import { diagnose } from '../src/logic/bottleneckCT.ts'
import { materialUsage, weightConversion } from '../src/logic/materialCalculators.ts'
import { calculateEfficiencyGap } from '../src/logic/efficiencyGap.ts'

for (const [draft, expected] of [['12',12],['12.5',12.5],['12,5',12.5],['0,75',.75],['58,03',58.03],['.5',.5],[',5',.5]] as const) {
  assert.equal(isValidDecimalDraft(draft), true)
  assert.equal(parseDecimalDraft(draft), expected)
}
for (const draft of ['12.5.6','12,5,6','12.5,6','12,5.6','1,234.56','1.234,56','abc','中文','ខ្មែរ']) {
  assert.equal(isValidDecimalDraft(draft), false)
  assert.equal(acceptDecimalDraft(draft, '58,03'), '58,03')
}
assert.equal(isValidDecimalDraft('12.'), true)
assert.equal(isValidDecimalDraft('12,'), true)

const multi = diagnose(50, [[60], [120]])
assert.ok(multi)
assert.equal(multi.capacity, 90)
assert.equal(multi.capacity * .9, 81)
assert.equal(multi.capacity * .8, 72)
assert.equal(multi.reached, true)
assert.equal(weightConversion(100,25.6,1280),5000)
const usage=materialUsage(80,4,5000,4100)
assert.ok(usage)
assert.equal(usage.perPieceCm,84)
assert.equal(usage.totalCm,420000)
assert.equal(usage.totalMeters,4200)
assert.equal(usage.difference,-100)
assert.equal(materialUsage(80,4,5000,4200)?.difference,0)

const gap=calculateEfficiencyGap({sam:10,workers:20,hours:8,targetEfficiency:95,outputs:[350,105,105,100,100,40]})
assert.equal(gap.valid,true)
assert.equal(gap.totalOutput,800)
assert.equal(gap.actualEfficiency,800/9.6)
assert.equal(gap.requiredTotalOutput,912)
assert.equal(gap.remainingPieces,112)
assert.equal(gap.reached,false)
const reachedGap=calculateEfficiencyGap({sam:10,workers:20,hours:8,targetEfficiency:105.5,outputs:[1013]})
assert.equal(reachedGap.requiredTotalOutput,1013)
assert.equal(reachedGap.remainingPieces,0)
assert.equal(reachedGap.reached,true)
const fractionalGap=calculateEfficiencyGap({sam:7,workers:13,hours:8,targetEfficiency:95,outputs:[800]})
assert.equal(fractionalGap.requiredTotalOutput,847)
assert.equal(fractionalGap.remainingPieces,47)

console.log('decimal input and CT capacity regression tests passed')
