<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { acceptDecimalDraft, parseDecimalDraft } from '../logic/decimalInput'

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
const draft=ref(props.modelValue==null?'':String(props.modelValue))
watch(()=>props.modelValue,value=>{const parsed=props.integer?(draft.value===''?null:Number(draft.value)):parseDecimalDraft(draft.value);if(value!==parsed)draft.value=value==null?'':String(value)})

function update(event: Event) {
  const target = event.target as HTMLInputElement
  const accepted=props.integer?(/^\d*$/.test(target.value)?target.value:draft.value):acceptDecimalDraft(target.value,draft.value)
  draft.value=accepted
  if (target.value !== accepted) target.value = accepted
  emit('update:modelValue', props.integer?(accepted===''?null:Number(accepted)):parseDecimalDraft(accepted))
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
        :value="draft" @input="update" @focus="focus" @click="click" @keydown.enter.prevent="advance();emit('enter')" />
      <span class="unit">{{ unit }}</span>
    </span>
    <small v-if="hint">{{ hint }}</small>
  </label>
</template>
