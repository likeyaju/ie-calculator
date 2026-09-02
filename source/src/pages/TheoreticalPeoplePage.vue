<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { displayNumber, theoreticalPeople } from '../logic/productionCalculators'

const target = ref<number | null>(null), sam = ref<number | null>(null), hours = ref<number | null>(null), efficiency = ref<number | null>(null)
const result = computed(() => theoreticalPeople(target.value ?? NaN, sam.value ?? NaN, hours.value ?? NaN, efficiency.value ?? NaN))
function reset() { target.value = sam.value = hours.value = efficiency.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('theoreticalPeople.title')}}</h1><p>{{t('theoreticalPeople.intro')}}</p></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="target" :label="t('theoreticalPeople.target')" :unit="t('common.pieces')" />
      <SafeNumberInput v-model="sam" label="SAM" :unit="t('common.minutes')" />
      <SafeNumberInput v-model="hours" :label="t('theoreticalPeople.hours')" :unit="t('common.hours')" />
      <SafeNumberInput v-model="efficiency" :label="t('theoreticalPeople.targetEfficiency')" unit="%" />
    </div></section>
    <section class="panel business-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <div v-if="result !== null" class="business-primary"><small>{{t('theoreticalPeople.required')}}</small><strong>{{displayNumber(result)}} <i>{{t('common.people')}}</i></strong></div>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="reset">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{t('theoreticalPeople.formula')}}</code></div></details>
  <details class="business-support"><summary>ⓘ {{t('theoreticalPeople.terms')}}</summary><div><p>{{t('theoreticalPeople.termText')}}</p></div></details>
</div></template>
