<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { displayNumber, taktFromDailyTarget, taktFromHourlyTarget } from '../logic/productionCalculators'

type Mode = 'hourly' | 'daily'
const mode = ref<Mode>('hourly'), target = ref<number | null>(null), hours = ref<number | null>(null)
const result = computed(() => mode.value === 'hourly' ? taktFromHourlyTarget(target.value ?? NaN) : taktFromDailyTarget(target.value ?? NaN, hours.value ?? NaN))
function setMode(value: Mode) { mode.value = value; target.value = hours.value = null }
function reset() { target.value = hours.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('taktTime.title')}}</h1><p>{{t('taktTime.intro')}}</p></section>
  <section class="business-mode-panel takt-mode" :class="mode"><div class="segmented"><button :class="{active:mode==='hourly'}" @click="setMode('hourly')">{{t('taktTime.hourlyMode')}}</button><button :class="{active:mode==='daily'}" @click="setMode('daily')">{{t('taktTime.dailyMode')}}</button></div></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="target" :label="mode==='hourly'?t('taktTime.hourlyTarget'):t('taktTime.dailyTarget')" :unit="mode==='hourly'?t('common.piecesPerHour'):t('common.pieces')" />
      <SafeNumberInput v-if="mode==='daily'" v-model="hours" :label="t('taktTime.workHours')" :unit="t('common.hours')" />
    </div></section>
    <section class="panel business-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <template v-if="result"><div class="business-primary"><small>TT</small><strong>{{displayNumber(result.takt)}} <i>{{t('taktTime.secondsPerPiece')}}</i></strong><p>{{t('taktTime.explanationBefore')}} {{displayNumber(result.takt)}} {{t('taktTime.explanationAfter')}}</p></div><div v-if="mode==='daily'" class="business-metrics"><div><small>{{t('taktTime.convertedHourly')}}</small><b>{{displayNumber(result.hourlyTarget)}} {{t('common.piecesPerHour')}}</b></div></div></template>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="reset">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{mode==='hourly'?t('taktTime.hourlyFormula'):t('taktTime.dailyFormula')}}</code></div></details>
  <details class="business-support"><summary>ⓘ {{t('taktTime.terms')}}</summary><div><p>{{t('taktTime.termText')}}</p></div></details>
</div></template>
