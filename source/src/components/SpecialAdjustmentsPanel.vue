<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import type { SpecialAdjustment } from '../logic/timeDifference'
import NativeDateTimeControl from './NativeDateTimeControl.vue'

const props = defineProps<{ modelValue: SpecialAdjustment[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: SpecialAdjustment[]] }>()
const open = ref(false)
const nextId = computed(() => Math.max(0, ...props.modelValue.map(item => item.id)) + 1)
function add(type: SpecialAdjustment['type']) { emit('update:modelValue', [...props.modelValue, { id: nextId.value, type, start: '', end: '' }]) }
function remove(id: number) { emit('update:modelValue', props.modelValue.filter(item => item.id !== id)) }
function updateItem(id: number, field: 'start' | 'end', value: string) { emit('update:modelValue', props.modelValue.map(item => item.id === id ? { ...item, [field]: value } : item)) }
</script>

<template>
  <section class="adjustment-card">
    <button type="button" class="adjustment-toggle" @click="open=!open"><span><strong>{{ t('timeDifference.adjustment') }}</strong><small>{{ t('timeDifference.adjustmentHint') }}</small></span><b>{{ open ? '−' : '+' }}</b></button>
    <div v-if="open" class="adjustment-body">
      <div class="adjustment-actions"><button type="button" @click="add('rest')">＋ {{ t('timeDifference.addRest') }}</button><button type="button" @click="add('work')">＋ {{ t('timeDifference.addWork') }}</button></div>
      <article v-for="item in modelValue" :key="item.id" class="adjustment-row" :class="item.type">
        <div class="adjustment-row-head"><strong>{{ item.type==='rest' ? t('timeDifference.specialRest') : t('timeDifference.specialWork') }}</strong><button type="button" @click="remove(item.id)">{{ t('timeDifference.remove') }}</button></div>
        <NativeDateTimeControl :model-value="item.start" type="datetime-local" :label="t('timeDifference.adjustmentStart')" @update:model-value="updateItem(item.id,'start',$event)" />
        <NativeDateTimeControl :model-value="item.end" type="datetime-local" :label="t('timeDifference.adjustmentEnd')" @update:model-value="updateItem(item.id,'end',$event)" />
      </article>
    </div>
  </section>
</template>
