<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: string; type: 'date' | 'time' | 'datetime-local'; label: string; timeFormat?: '24' | '12' }>(), { timeFormat: '24' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
function display() {
  if (props.type === 'time' && props.modelValue && props.timeFormat === '12') {
    const [hourText, minute='00'] = props.modelValue.split(':'); const hour=Number(hourText)
    return `${hour%12||12}:${minute} ${hour<12?'AM':'PM'}`
  }
  if (props.modelValue) return props.type === 'datetime-local' ? props.modelValue.replace('T', ' ') : props.modelValue
  return props.type === 'date' ? '---- -- --' : props.type === 'time' ? '--:--' : '---- -- --  --:--'
}
function update(event: Event) { emit('update:modelValue', (event.target as HTMLInputElement).value) }
</script>

<template>
  <label class="shared-native-field"><span>{{ label }}</span><span class="native-control"><input :type="type" :value="modelValue" @input="update"><b>{{ display() }}</b></span></label>
</template>
