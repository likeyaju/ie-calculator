<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { displayNumber, targetOutput } from '../logic/productionCalculators'

const targetEfficiency = ref<number | null>(null), workers = ref<number | null>(null), hours = ref<number | null>(null), sam = ref<number | null>(null)
const result = computed(() => targetOutput(targetEfficiency.value ?? NaN, workers.value ?? NaN, hours.value ?? NaN, sam.value ?? NaN))
function reset() { targetEfficiency.value = workers.value = hours.value = sam.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('targetOutput.title')}}</h1><p>{{t('targetOutput.intro')}}</p></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="targetEfficiency" :label="t('targetOutput.targetEfficiency')" unit="%" />
      <SafeNumberInput v-model="workers" :label="t('targetOutput.workers')" :unit="t('common.people')" />
      <SafeNumberInput v-model="hours" :label="t('targetOutput.hours')" :unit="t('common.hours')" />
      <SafeNumberInput v-model="sam" label="SAM" :unit="t('common.minutes')" />
    </div></section>
    <section class="panel business-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <div v-if="result !== null" class="business-primary"><small>{{t('targetOutput.required')}}</small><strong>{{displayNumber(result)}} <i>{{t('common.pieces')}}</i></strong></div>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="reset">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{t('targetOutput.formula')}}</code></div></details>
  <details class="business-support"><summary>ⓘ {{t('targetOutput.terms')}}</summary><div><p>{{t('targetOutput.termText')}}</p></div></details>
</div></template>
