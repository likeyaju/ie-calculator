<script setup lang="ts">
import { nextTick, ref } from 'vue'
defineProps<{ modelValue: number | null; label: string; hint: string; unit: string; optional?: string; step?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()
const input=ref<HTMLInputElement|null>(null),justFocused=ref(false),enterHint=ref<'next'|'done'>('next')
function sanitize(raw:string){const normalized=raw.replace(/[^0-9.]/g,'');const dot=normalized.indexOf('.');return dot<0?normalized:normalized.slice(0,dot+1)+normalized.slice(dot+1).replace(/\./g,'')}
function update(e:Event){const target=e.target as HTMLInputElement,clean=sanitize(target.value);if(clean!==target.value)target.value=clean;emit('update:modelValue',clean===''||clean==='.'?null:Number(clean))}
function allInputs(){return [...(input.value?.closest('.page')?.querySelectorAll<HTMLInputElement>('input:not([disabled])')??[])]}
function focus(){justFocused.value=true;const inputs=allInputs();enterHint.value=inputs.indexOf(input.value!)===inputs.length-1?'done':'next';nextTick(()=>input.value?.select())}
function click(e:MouseEvent){if(justFocused.value){e.preventDefault();input.value?.select();justFocused.value=false}}
function advance(){const inputs=allInputs(),index=inputs.indexOf(input.value!);if(index>=0&&index<inputs.length-1)inputs[index+1].focus();else input.value?.blur()}
</script>
<template><label class="field"><span class="field-label">{{ label }} <em v-if="optional">{{ optional }}</em></span><span class="input-wrap"><input ref="input" type="text" inputmode="decimal" :enterkeyhint="enterHint" autocomplete="off" :value="modelValue ?? ''" @input="update" @focus="focus" @click="click" @keydown.enter.prevent="advance"/><span class="unit">{{ unit }}</span></span><small>{{ hint }}</small></label></template>
