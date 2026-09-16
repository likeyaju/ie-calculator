<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { acceptDecimalDraft, parseDecimalDraft } from '../logic/decimalInput'
const props=defineProps<{ modelValue: number | null; label: string; hint: string; unit: string; optional?: string; step?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()
const input=ref<HTMLInputElement|null>(null),justFocused=ref(false),enterHint=ref<'next'|'done'>('next')
const draft=ref(props.modelValue==null?'':String(props.modelValue))
watch(()=>props.modelValue,value=>{const parsed=parseDecimalDraft(draft.value);if(value!==parsed)draft.value=value==null?'':String(value)})
function update(e:Event){const target=e.target as HTMLInputElement,accepted=acceptDecimalDraft(target.value,draft.value);draft.value=accepted;if(target.value!==accepted)target.value=accepted;emit('update:modelValue',parseDecimalDraft(accepted))}
function allInputs(){return [...(input.value?.closest('.page')?.querySelectorAll<HTMLInputElement>('input:not([disabled])')??[])]}
function focus(){justFocused.value=true;const inputs=allInputs();enterHint.value=inputs.indexOf(input.value!)===inputs.length-1?'done':'next';nextTick(()=>input.value?.select())}
function click(e:MouseEvent){if(justFocused.value){e.preventDefault();input.value?.select();justFocused.value=false}}
function advance(){const inputs=allInputs(),index=inputs.indexOf(input.value!);if(index>=0&&index<inputs.length-1)inputs[index+1].focus();else input.value?.blur()}
</script>
<template><label class="field"><span class="field-label">{{ label }} <em v-if="optional">{{ optional }}</em></span><span class="input-wrap"><input ref="input" type="text" inputmode="decimal" :enterkeyhint="enterHint" autocomplete="off" :value="draft" @input="update" @focus="focus" @click="click" @keydown.enter.prevent="advance"/><span class="unit">{{ unit }}</span></span><small>{{ hint }}</small></label></template>
