<script setup lang="ts">
import { reactive, ref } from 'vue'
import { t } from '../i18n'

type Source = keyof typeof values
const copied = ref('')
const preciseSeconds = ref<number | null>(null)
let touchStartedAt = 0
const values = reactive({
  totalHours: '', totalMinutes: '', totalSeconds: '',
  hmH: '', hmM: '', msM: '', msS: '', hmsH: '', hmsM: '', hmsS: '',
  day: '', dayH: '', dayM: '', dayS: '', clockH: '', clockM: '', clockHs: '', clockMs: '', clockS: '', excel: ''
})

function n(value: string) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0 }
function clean(value: number) { return Number(value.toPrecision(12)).toString() }
function displayed(key: Source, value: number) {
  if (key === 'totalHours') return value.toFixed(2)
  if (key === 'totalMinutes') return value.toFixed(1)
  if (key === 'excel') return clean(value)
  return Math.round(value).toString()
}
function setValue(key: Source, value: number, source: Source | null) { if (key !== source) values[key] = displayed(key, value) }
function sync(seconds: number, source: Source | null) {
  const safe = Math.max(0, seconds)
  preciseSeconds.value = safe
  const whole = Math.floor(safe)
  const hours = Math.floor(whole / 3600)
  const minutes = Math.floor((whole % 3600) / 60)
  const secs = whole % 60
  setValue('totalHours', safe / 3600, source); setValue('totalMinutes', safe / 60, source); setValue('totalSeconds', safe, source)
  setValue('hmH', hours, source); setValue('hmM', minutes, source)
  setValue('msM', Math.floor(whole / 60), source); setValue('msS', secs, source)
  setValue('hmsH', hours, source); setValue('hmsM', minutes, source); setValue('hmsS', secs, source)
  setValue('day', Math.floor(whole / 86400), source); setValue('dayH', Math.floor((whole % 86400) / 3600), source); setValue('dayM', minutes, source); setValue('dayS', secs, source)
  setValue('clockH', hours, source); setValue('clockM', minutes, source)
  setValue('clockHs', hours, source); setValue('clockMs', minutes, source); setValue('clockS', secs, source)
  setValue('excel', safe / 86400, source)
}
function edit(key: Source, event: Event, seconds: () => number) {
  const input = event.target as HTMLInputElement
  const raw = input.value
  const numeric = raw.replace(/[^0-9.]/g, '')
  const parts = numeric.split('.')
  const sanitized = (parts.shift() ?? '') + (parts.length ? `.${parts.join('')}` : '')
  values[key] = sanitized
  if (input.value !== sanitized) input.value = sanitized
  if (values[key] === '') return
  sync(seconds(), key)
}
function reset() { Object.keys(values).forEach(key => values[key as Source] = ''); copied.value = ''; preciseSeconds.value = null }
function prepareTouchInput(event: PointerEvent) {
  const input = event.target
  if (event.pointerType === 'mouse' || !(input instanceof HTMLInputElement)) return
  event.preventDefault()
  touchStartedAt = Date.now()
  input.focus({ preventScroll: true })
  input.setSelectionRange(0, input.value.length)
}
function selectInput(event: Event) {
  const input = event.target
  if (input instanceof HTMLInputElement) {
    if (Date.now() - touchStartedAt < 700) return
    input.focus({ preventScroll: true })
    input.select()
  }
}
function finishEditing() { if (preciseSeconds.value !== null) sync(preciseSeconds.value, null) }
function handleKeydown(event: KeyboardEvent) {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  if (event.ctrlKey || event.metaKey) return
  if (event.key === 'Enter') {
    event.preventDefault()
    const inputs = Array.from(input.closest('main')?.querySelectorAll('input') ?? [])
    const index = inputs.indexOf(input)
    const next = inputs[index + 1]
    if (next) { next.focus({ preventScroll: true }); next.select() } else input.blur()
    return
  }
  const allowed = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'Home', 'End']
  if (/^[0-9]$/.test(event.key) || allowed.includes(event.key)) return
  if (event.key === '.' && (!input.value.includes('.') || input.selectionStart !== input.selectionEnd)) return
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const group = input.closest('.group-input')
    if (!group) return
    const inputs = Array.from(group.querySelectorAll('input'))
    const index = inputs.indexOf(input)
    const goLeft = event.key === 'ArrowLeft' && input.selectionStart === 0 && index > 0
    const goRight = event.key === 'ArrowRight' && input.selectionEnd === input.value.length && index < inputs.length - 1
    if (goLeft || goRight) {
      event.preventDefault()
      const next = inputs[index + (goRight ? 1 : -1)]
      next.focus(); next.select()
    }
    return
  }
  event.preventDefault()
}
async function copy(key: Source) {
  if (!values[key]) return
  await copyText(key, values[key])
}
function pad(value: string) { return String(Math.max(0, Math.round(n(value)))).padStart(2, '0') }
async function copyText(id: string, text: string) {
  try { await navigator.clipboard.writeText(text); copied.value = id; window.setTimeout(() => copied.value = '', 1200) } catch { /* clipboard may be unavailable in local files */ }
}
</script>

<template>
  <main class="page time-conversion-page" @pointerdown.capture="prepareTouchInput" @focusin="selectInput" @keydown="handleKeydown" @focusout="finishEditing" @change="finishEditing">
    <section class="time-convert-heading">
      <div><h1>{{ t('timeConvert.title') }}</h1><p>{{ t('timeConvert.intro') }}</p></div>
      <button type="button" @click="reset">↻ {{ t('timeConvert.reset') }}</button>
    </section>

    <section class="time-section">
      <h2>{{ t('timeConvert.total') }}</h2>
      <div class="time-fields three">
        <label><span>{{ t('timeConvert.totalHours') }}</span><span class="time-input"><input inputmode="decimal" :value="values.totalHours" @input="edit('totalHours',$event,()=>n(values.totalHours)*3600)"><i>{{ t('timeConvert.hour') }}</i></span><button @click="copy('totalHours')">{{ copied==='totalHours'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
        <label><span>{{ t('timeConvert.totalMinutes') }}</span><span class="time-input"><input inputmode="decimal" :value="values.totalMinutes" @input="edit('totalMinutes',$event,()=>n(values.totalMinutes)*60)"><i>{{ t('timeConvert.minute') }}</i></span><button @click="copy('totalMinutes')">{{ copied==='totalMinutes'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
        <label><span>{{ t('timeConvert.totalSeconds') }}</span><span class="time-input"><input inputmode="decimal" :value="values.totalSeconds" @input="edit('totalSeconds',$event,()=>n(values.totalSeconds))"><i>{{ t('timeConvert.second') }}</i></span><button @click="copy('totalSeconds')">{{ copied==='totalSeconds'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
      </div>
    </section>

    <section class="time-section">
      <h2>{{ t('timeConvert.combined') }}</h2>
      <div class="time-fields three">
        <label><span>{{ t('timeConvert.hoursMinutes') }}</span><span class="group-input"><input inputmode="decimal" :placeholder="t('timeConvert.hour')" :value="values.hmH" @input="edit('hmH',$event,()=>n(values.hmH)*3600+n(values.hmM)*60)"><i>:</i><input inputmode="decimal" :placeholder="t('timeConvert.minute')" :value="values.hmM" @input="edit('hmM',$event,()=>n(values.hmH)*3600+n(values.hmM)*60)"></span></label>
        <label><span>{{ t('timeConvert.minutesSeconds') }}</span><span class="group-input"><input inputmode="decimal" :placeholder="t('timeConvert.minute')" :value="values.msM" @input="edit('msM',$event,()=>n(values.msM)*60+n(values.msS))"><i>:</i><input inputmode="decimal" :placeholder="t('timeConvert.second')" :value="values.msS" @input="edit('msS',$event,()=>n(values.msM)*60+n(values.msS))"></span></label>
        <label><span>{{ t('timeConvert.hoursMinutesSeconds') }}</span><span class="group-input"><input inputmode="decimal" :value="values.hmsH" @input="edit('hmsH',$event,()=>n(values.hmsH)*3600+n(values.hmsM)*60+n(values.hmsS))"><i>:</i><input inputmode="decimal" :value="values.hmsM" @input="edit('hmsM',$event,()=>n(values.hmsH)*3600+n(values.hmsM)*60+n(values.hmsS))"><i>:</i><input inputmode="decimal" :value="values.hmsS" @input="edit('hmsS',$event,()=>n(values.hmsH)*3600+n(values.hmsM)*60+n(values.hmsS))"></span></label>
      </div>
    </section>

    <section class="time-section">
      <h2>{{ t('timeConvert.clock') }}</h2>
      <div class="time-fields clock-grid">
        <label class="wide"><span>{{ t('timeConvert.daysTime') }}</span><span class="group-input four"><input inputmode="decimal" :placeholder="t('timeConvert.day')" :value="values.day" @input="edit('day',$event,()=>n(values.day)*86400+n(values.dayH)*3600+n(values.dayM)*60+n(values.dayS))"><i>:</i><input inputmode="decimal" :placeholder="t('timeConvert.hour')" :value="values.dayH" @input="edit('dayH',$event,()=>n(values.day)*86400+n(values.dayH)*3600+n(values.dayM)*60+n(values.dayS))"><i>:</i><input inputmode="decimal" :placeholder="t('timeConvert.minute')" :value="values.dayM" @input="edit('dayM',$event,()=>n(values.day)*86400+n(values.dayH)*3600+n(values.dayM)*60+n(values.dayS))"><i>:</i><input inputmode="decimal" :placeholder="t('timeConvert.second')" :value="values.dayS" @input="edit('dayS',$event,()=>n(values.day)*86400+n(values.dayH)*3600+n(values.dayM)*60+n(values.dayS))"></span></label>
        <label class="copyable-group"><span>{{ t('timeConvert.hourMinute') }}</span><span class="group-input"><input inputmode="decimal" :value="values.clockH" @input="edit('clockH',$event,()=>n(values.clockH)*3600+n(values.clockM)*60)"><i>:</i><input inputmode="decimal" :value="values.clockM" @input="edit('clockM',$event,()=>n(values.clockH)*3600+n(values.clockM)*60)"></span><button @click="copyText('clockHM',`${values.clockH || '0'}:${pad(values.clockM)}`)">{{ copied==='clockHM'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
        <label class="copyable-group"><span>{{ t('timeConvert.hourMinuteSecond') }}</span><span class="group-input"><input inputmode="decimal" :value="values.clockHs" @input="edit('clockHs',$event,()=>n(values.clockHs)*3600+n(values.clockMs)*60+n(values.clockS))"><i>:</i><input inputmode="decimal" :value="values.clockMs" @input="edit('clockMs',$event,()=>n(values.clockHs)*3600+n(values.clockMs)*60+n(values.clockS))"><i>:</i><input inputmode="decimal" :value="values.clockS" @input="edit('clockS',$event,()=>n(values.clockHs)*3600+n(values.clockMs)*60+n(values.clockS))"></span><button @click="copyText('clockHMS',`${values.clockHs || '0'}:${pad(values.clockMs)}:${pad(values.clockS)}`)">{{ copied==='clockHMS'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
        <label><span>{{ t('timeConvert.excel') }}</span><span class="time-input"><input inputmode="decimal" :value="values.excel" @input="edit('excel',$event,()=>n(values.excel)*86400)"><i>{{ t('timeConvert.excelMultiplier') }}</i></span><small>{{ t('timeConvert.excelHint') }}</small><button @click="copy('excel')">{{ copied==='excel'?t('timeConvert.copied'):t('timeConvert.copy') }}</button></label>
      </div>
    </section>
  </main>
</template>
