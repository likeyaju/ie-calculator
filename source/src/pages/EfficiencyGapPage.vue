<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { calculateEfficiencyGap } from '../logic/efficiencyGap'

const MINIMUM_ROWS = 10
const form = reactive({ sam: null as number | null, workers: null as number | null, hours: null as number | null, targetEfficiency: null as number | null })
const outputDrafts = ref<string[]>(Array(MINIMUM_ROWS).fill(''))
const formulaOpen = ref(false)

const outputValues = computed(() => outputDrafts.value.filter(value => value !== '').map(Number))
const outputTotal = computed(() => outputValues.value.reduce((sum, value) => sum + value, 0))
const result = computed(() => calculateEfficiencyGap({ ...form, outputs: outputValues.value }))
const touched = computed(() => Object.values(form).some(value => value !== null) || outputDrafts.value.some(Boolean))

function updateOutput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const previous = outputDrafts.value[index]
  const accepted = /^\d*$/.test(input.value) ? input.value : previous
  outputDrafts.value[index] = accepted
  if (input.value !== accepted) input.value = accepted
  if (index === outputDrafts.value.length - 1 && accepted !== '') outputDrafts.value.push('')
}

function focusOutput(index: number, event: FocusEvent) {
  const input = event.target as HTMLInputElement
  if (index === outputDrafts.value.length - 1 && outputDrafts.value[index] !== '') outputDrafts.value.push('')
  input.dataset.justFocused = '1'
  nextTick(() => input.select())
}

function clickOutput(event: MouseEvent) {
  const input = event.currentTarget as HTMLInputElement
  if (input.dataset.justFocused === '1') {
    event.preventDefault()
    input.select()
    input.dataset.justFocused = '0'
  }
}

function advanceOutput(index: number) {
  if (index === outputDrafts.value.length - 1) outputDrafts.value.push('')
  nextTick(() => document.querySelector<HTMLInputElement>(`.efficiency-gap-page input[data-output-index="${index + 1}"]`)?.focus())
}

function compactOutputs() {
  setTimeout(() => {
    if (document.activeElement?.closest('.output-records-grid')) return
    while (outputDrafts.value.length > MINIMUM_ROWS && outputDrafts.value.at(-1) === '' && outputDrafts.value.at(-2) === '') outputDrafts.value.pop()
  }, 0)
}

function reset() {
  Object.assign(form, { sam: null, workers: null, hours: null, targetEfficiency: null })
  outputDrafts.value = Array(MINIMUM_ROWS).fill('')
}

function keepFocusedInputVisible(event: FocusEvent) {
  const target = event.target as HTMLElement
  if (!target.matches('.efficiency-gap-page input')) return
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }), 250)
}

function formatDecimal(value: number) { return Number(value.toFixed(2)).toString() }

onMounted(() => document.addEventListener('focusin', keepFocusedInputVisible))
onBeforeUnmount(() => document.removeEventListener('focusin', keepFocusedInputVisible))
</script>

<template>
  <div class="page efficiency-gap-page">
    <section class="gap-result-card" :class="result.valid ? (result.reached ? 'reached' : 'below') : ''">
      <div class="gap-result-head"><span>{{ t('efficiencyGap.result') }}</span><b v-if="result.valid">{{ t('efficiencyGap.live') }}</b></div>
      <template v-if="result.valid">
        <div class="gap-primary">
          <small>{{ result.reached ? t('efficiencyGap.reached') : t('efficiencyGap.remaining') }}</small>
          <strong>{{ result.remainingPieces }}<i>{{ t('efficiencyGap.units.pcs') }}</i></strong>
          <p>{{ result.reached ? t('efficiencyGap.reachedNote') : t('efficiencyGap.reachNote') }} {{ formatDecimal(form.targetEfficiency!) }}%</p>
        </div>
        <div class="gap-metrics">
          <span><small>{{ t('efficiencyGap.totalOutput') }}</small><b>{{ result.totalOutput }} {{ t('efficiencyGap.units.pcs') }}</b></span>
          <span><small>{{ t('efficiencyGap.actualEfficiency') }}</small><b>{{ result.actualEfficiency.toFixed(2) }}%</b></span>
          <span><small>{{ t('efficiencyGap.requiredTotal') }}</small><b>{{ result.requiredTotalOutput }} {{ t('efficiencyGap.units.pcs') }}</b></span>
          <span><small>{{ t('efficiencyGap.difference') }}</small><b>{{ result.efficiencyDifference >= 0 ? '+' : '' }}{{ result.efficiencyDifference.toFixed(2) }} {{ t('efficiencyGap.points') }}</b></span>
        </div>
        <p class="gap-safety-note">{{ t('efficiencyGap.safetyNote') }}</p>
      </template>
      <p v-else class="gap-waiting">{{ touched ? t('efficiencyGap.invalid') : t('efficiencyGap.waiting') }}</p>
    </section>

    <section class="gap-input-card">
      <h2><span>01</span>{{ t('efficiencyGap.basicInfo') }}</h2>
      <div class="gap-basic-grid">
        <SafeNumberInput v-model="form.sam" :label="t('efficiencyGap.sam')" :unit="t('efficiencyGap.units.min')" />
        <SafeNumberInput v-model="form.workers" integer :label="t('efficiencyGap.workers')" :unit="t('efficiencyGap.units.people')" />
        <SafeNumberInput v-model="form.hours" :label="t('efficiencyGap.hours')" :unit="t('efficiencyGap.units.hour')" />
        <SafeNumberInput v-model="form.targetEfficiency" :label="t('efficiencyGap.targetEfficiency')" :unit="t('efficiencyGap.units.percent')" />
      </div>
    </section>

    <section class="gap-input-card output-records-card">
      <div class="output-records-head">
        <div><h2><span>02</span>{{ t('efficiencyGap.outputRecords') }}</h2><small>{{ t('efficiencyGap.recordsHint') }}</small></div>
        <p>{{ t('efficiencyGap.enteredTotal') }} <b>{{ outputTotal }}</b> {{ t('efficiencyGap.units.pcs') }}</p>
      </div>
      <div class="output-records-grid" @focusout="compactOutputs">
        <label v-for="(value, index) in outputDrafts" :key="index" class="output-record-field">
          <span>{{ index + 1 }}</span>
          <input type="text" inputmode="numeric" :enterkeyhint="index === outputDrafts.length - 1 ? 'done' : 'next'" :data-output-index="index" :value="value" :aria-label="`${t('efficiencyGap.record')} ${index + 1}`" @input="updateOutput(index, $event)" @focus="focusOutput(index, $event)" @click="clickOutput" @keydown.enter.prevent="advanceOutput(index)">
          <i>{{ t('efficiencyGap.units.pcs') }}</i>
        </label>
      </div>
    </section>

    <section class="gap-actions">
      <button class="gap-formula-toggle" :aria-expanded="formulaOpen" @click="formulaOpen = !formulaOpen"><span>ƒx&nbsp; {{ t('efficiencyGap.formulaTitle') }}</span><b>{{ formulaOpen ? '−' : '+' }}</b></button>
      <div v-if="formulaOpen" class="gap-formulas">
        <p>{{ t('efficiencyGap.formula1') }}</p><p>{{ t('efficiencyGap.formula2') }}</p><p>{{ t('efficiencyGap.formula3') }}</p><p>{{ t('efficiencyGap.formula4') }}</p>
      </div>
      <button class="gap-reset" @click="reset">↻ {{ t('efficiencyGap.reset') }}</button>
    </section>
  </div>
</template>
