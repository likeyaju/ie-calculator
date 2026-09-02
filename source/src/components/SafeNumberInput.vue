<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number | null
  label: string
  unit: string
  hint?: string
  optional?: string
  integer?: boolean
}>(), { hint: '', optional: '', integer: false })
const emit = defineEmits<{ 'update:modelValue': [value: number | null]; enter: [] }>()
const input = ref<HTMLInputElement | null>(null)
const justFocused = ref(false), enterHint = ref<'next'|'done'>('next')

function sanitize(raw: string) {
  const normalized = raw.replace(/[^0-9.]/g, '')
  if (props.integer) return normalized.replace(/\./g, '')
  const dot = normalized.indexOf('.')
  return dot < 0 ? normalized : normalized.slice(0, dot + 1) + normalized.slice(dot + 1).replace(/\./g, '')
}

function update(event: Event) {
  const target = event.target as HTMLInputElement
  const clean = sanitize(target.value)
  if (target.value !== clean) target.value = clean
  emit('update:modelValue', clean === '' || clean === '.' ? null : Number(clean))
}

function focus() {
  justFocused.value = true
  const inputs=[...(input.value?.closest('.page')?.querySelectorAll<HTMLInputElement>('input:not([disabled])')??[])]
  enterHint.value=inputs.indexOf(input.value!)===inputs.length-1?'done':'next'
  nextTick(() => input.value?.select())
}

function click(event: MouseEvent) {
  if (justFocused.value) {
    event.preventDefault()
    input.value?.select()
    justFocused.value = false
  }
}
function advance(){const inputs=[...(input.value?.closest('.page')?.querySelectorAll<HTMLInputElement>('input:not([disabled])')??[])],index=inputs.indexOf(input.value!);if(index>=0&&index<inputs.length-1)inputs[index+1].focus();else input.value?.blur()}
</script>

<template>
  <label class="field safe-number-field">
    <span class="field-label">{{ label }} <em v-if="optional">{{ optional }}</em></span>
    <span class="input-wrap">
      <input ref="input" type="text" :inputmode="integer ? 'numeric' : 'decimal'" :enterkeyhint="enterHint" autocomplete="off"
        :value="modelValue ?? ''" @input="update" @focus="focus" @click="click" @keydown.enter.prevent="advance();emit('enter')" />
      <span class="unit">{{ unit }}</span>
    </span>
    <small v-if="hint">{{ hint }}</small>
  </label>
</template>
