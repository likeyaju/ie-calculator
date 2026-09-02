<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { displayNumber, lineBalance } from '../logic/productionCalculators'

const tct = ref<number | null>(null), count = ref<number | null>(null), maxCt = ref<number | null>(null)
const result = computed(() => lineBalance(tct.value ?? NaN, count.value ?? NaN, maxCt.value ?? NaN))
function reset() { tct.value = count.value = maxCt.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('lineBalance.title')}}</h1><p>{{t('lineBalance.intro')}}</p></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="tct" label="TCT" :unit="t('common.seconds')" />
      <SafeNumberInput v-model="count" :label="t('lineBalance.processCount')" :unit="t('common.countUnit')" integer />
      <SafeNumberInput v-model="maxCt" :label="t('lineBalance.maxCt')" :unit="t('common.seconds')" class="full-field" />
    </div></section>
    <section class="panel business-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <div v-if="result !== null" class="business-primary"><small>{{t('lineBalance.resultLabel')}}</small><strong>{{displayNumber(result)}} <i>%</i></strong></div>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="reset">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{t('lineBalance.formula')}}</code></div></details>
  <details class="business-support"><summary>ⓘ {{t('lineBalance.terms')}}</summary><div><p>{{t('lineBalance.termText')}}</p></div></details>
</div></template>
