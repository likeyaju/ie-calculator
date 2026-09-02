<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import SafeNumberInput from '../components/SafeNumberInput.vue'
import { achievement, displayNumber, reverseAchievement } from '../logic/productionCalculators'

type BusinessType = 'quantity' | 'efficiency'
type Direction = 'forward' | 'reverse'
const businessType = ref<BusinessType>('quantity'), direction = ref<Direction>('forward')
const target = ref<number | null>(null), actual = ref<number | null>(null), rate = ref<number | null>(null)
const result = computed(() => direction.value === 'forward' ? achievement(actual.value ?? NaN, target.value ?? NaN) : reverseAchievement(target.value ?? NaN, rate.value ?? NaN))
const difference = computed(() => direction.value === 'forward' && actual.value !== null && target.value !== null ? actual.value - target.value : null)
function changeType(value: BusinessType) { businessType.value = value; resetValues() }
function changeDirection(value: Direction) { direction.value = value; resetValues() }
function resetValues() { target.value = actual.value = rate.value = null }
</script>
<template><div class="page business-page">
  <section class="page-intro"><h1>{{t('achievement.title')}}</h1><p>{{t('achievement.intro')}}</p></section>
  <section class="business-mode-panel"><div class="segmented"><button :class="{active:businessType==='quantity'}" @click="changeType('quantity')">{{t('achievement.quantity')}}</button><button :class="{active:businessType==='efficiency'}" @click="changeType('efficiency')">{{t('achievement.efficiency')}}</button></div><div class="segmented"><button :class="{active:direction==='forward'}" @click="changeDirection('forward')">{{t('achievement.forward')}}</button><button :class="{active:direction==='reverse'}" @click="changeDirection('reverse')">{{t('achievement.reverse')}}</button></div></section>
  <div class="business-layout">
    <section class="panel"><h2><span>01</span>{{t('common.input')}}</h2><div class="fields-grid">
      <SafeNumberInput v-model="target" :label="businessType==='quantity'?t('achievement.targetQuantity'):t('achievement.targetEfficiency')" :unit="businessType==='quantity'?t('common.pieces'):'%'" />
      <SafeNumberInput v-if="direction==='forward'" v-model="actual" :label="businessType==='quantity'?t('achievement.actualQuantity'):t('achievement.actualEfficiency')" :unit="businessType==='quantity'?t('common.pieces'):'%'" />
      <SafeNumberInput v-else v-model="rate" :label="t('achievement.rate')" unit="%" />
    </div></section>
    <section class="panel business-result"><h2><span>02</span>{{t('common.result')}}</h2>
      <template v-if="result !== null"><div class="business-primary"><small>{{direction==='forward'?t('achievement.rate'):t('achievement.theoreticalActual')}}</small><strong>{{displayNumber(result)}} <i>{{direction==='forward'?'%':businessType==='quantity'?t('common.pieces'):'%'}}</i></strong></div>
      <div v-if="direction==='forward' && difference !== null" class="business-metrics"><div><small>{{businessType==='quantity'?t('achievement.quantityDifference'):t('achievement.efficiencyDifference')}}</small><b>{{difference>0?'+':''}}{{displayNumber(difference)}} {{businessType==='quantity'?t('common.pieces'):t('achievement.points')}}</b></div><div><small>{{t('achievement.status')}}</small><b class="achievement-status" :class="result>=100?'reached':'not-reached'">{{result>=100?t('achievement.reached'):t('achievement.notReached')}}</b></div></div></template>
      <p v-else class="business-waiting">{{t('common.waiting')}}</p><button class="business-reset" @click="resetValues">↻ {{t('common.reset')}}</button>
    </section>
  </div>
  <details class="business-support" open><summary>ƒx {{t('common.formula')}}</summary><div><code>{{businessType==='quantity'?t('achievement.quantityFormula'):t('achievement.efficiencyFormula')}}</code></div></details>
</div></template>
