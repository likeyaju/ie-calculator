<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { capacityByCt, displayNumber } from '../logic/productionCalculators'

const ct = ref<number | null>(null), hours = ref<number | null>(null)
const rows = computed(() => [1, .9, .8].map(rate => ({ rate, value: capacityByCt(ct.value ?? NaN, rate, hours.value) })))
function reset() { ct.value = hours.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('ctCapacity.title')}}</h1><p>{{t('ctCapacity.intro')}}</p></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="ct" label="CT" :unit="t('common.seconds')" />
      <SafeNumberInput v-model="hours" :label="t('ctCapacity.workHours')" :unit="t('common.hours')" :optional="t('common.optional')" />
    </div></section>
    <section class="panel business-result capacity-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <div v-if="rows[0].value" class="capacity-grid"><article v-for="row in rows" :key="row.rate"><b>{{row.rate * 100}}%</b><span>{{t('ctCapacity.hourly')}}</span><strong>{{displayNumber(row.value!.hourly)}} <i>{{t('common.piecesPerHour')}}</i></strong><template v-if="row.value!.total !== null"><span>{{t('ctCapacity.periodTotal')}}</span><strong>{{displayNumber(row.value!.total!)}} <i>{{t('common.pieces')}}</i></strong></template></article></div>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="reset">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{t('ctCapacity.formula')}}</code></div></details>
  <details class="business-support"><summary>ⓘ {{t('ctCapacity.terms')}}</summary><div><p>{{t('ctCapacity.termText')}}</p></div></details>
</div></template>
