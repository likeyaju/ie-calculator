<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { t } from '../i18n'
import NativeDateTimeControl from '../components/NativeDateTimeControl.vue'
import SpecialAdjustmentsPanel from '../components/SpecialAdjustmentsPanel.vue'
import WorkScheduleSummary from '../components/WorkScheduleSummary.vue'
import { restoreDefaultWorkSchedule, workSchedule } from '../logic/workSchedule'
import { applyCalendarPart, traverseWorkingTime, type Direction, type TraversalEvent } from '../logic/timeAddSubtract'
import { nonWorkingReasonAt, type NonWorkingReason, type SpecialAdjustment } from '../logic/timeDifference'

type TimeMode = 'company' | 'natural'
const now = new Date()
const startDate = ref(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`)
const startTime = ref('')
const dateEnabled = ref(true)
const timeEnabled = ref(true)
const direction = ref<Direction>('add')
const mode = ref<TimeMode>('company')
const amounts = reactive({ years: '', months: '', days: '', hours: '', minutes: '', seconds: '' })
const adjustments = ref<SpecialAdjustment[]>([])

const fields = ['years','months','days','hours','minutes','seconds'] as const
type AmountKey = typeof fields[number]
const dateFields: AmountKey[] = ['years','months','days']
const timeFields: AmountKey[] = ['hours','minutes','seconds']
const visibleFields = computed(() => fields.filter(key => dateEnabled.value ? (timeEnabled.value || dateFields.includes(key)) : timeFields.includes(key)))
function amount(key: AmountKey) { return amounts[key] === '' ? 0 : Number(amounts[key]) }
function sanitize(key: AmountKey, event: Event) { const input=event.target as HTMLInputElement; const value=input.value.replace(/\D/g,''); amounts[key]=value; if(input.value!==value) input.value=value }
function durationKeydown(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement
  if (event.key !== 'Enter') return
  event.preventDefault()
  const all = Array.from(document.querySelectorAll<HTMLInputElement>('.duration-grid input'))
  const index = all.indexOf(input)
  if (index < all.length-1) { all[index+1].focus(); all[index+1].select() } else input.blur()
}
function dismissKeyboard(event: PointerEvent) { if (!(event.target instanceof HTMLInputElement)) (document.activeElement as HTMLElement | null)?.blur?.() }

function togglePart(part:'date'|'time') {
  if (part==='date') { if (dateEnabled.value && !timeEnabled.value) return; dateEnabled.value=!dateEnabled.value }
  else { if (timeEnabled.value && !dateEnabled.value) return; timeEnabled.value=!timeEnabled.value }
}
const activeFields = computed(() => [...(dateEnabled.value?dateFields:[]), ...(timeEnabled.value?timeFields:[])])
const hasDuration = computed(() => activeFields.value.some(key => amounts[key] !== ''))
const calculation = computed(() => {
  if ((dateEnabled.value && !startDate.value) || (timeEnabled.value && !startTime.value) || !hasDuration.value) return null
  const calculationDate = dateEnabled.value ? startDate.value : '2000-01-03'
  const calculationTime = timeEnabled.value ? startTime.value : '00:00'
  const start = new Date(`${calculationDate}T${calculationTime}:00`)
  if (!Number.isFinite(start.getTime())) return null
  const calendarResult = applyCalendarPart(start, dateEnabled.value?amount('years'):0, dateEnabled.value?amount('months'):0, dateEnabled.value?amount('days'):0, direction.value)
  const durationMs = timeEnabled.value ? (amount('hours')*3600 + amount('minutes')*60 + amount('seconds')) * 1000 : 0
  if (mode.value === 'natural') {
    const sign = direction.value === 'add' ? 1 : -1
    return { start, calendarResult, final: new Date(calendarResult.getTime()+sign*durationMs), durationMs, events: [], unresolved:false }
  }
  const traversed = traverseWorkingTime(calendarResult.getTime(), durationMs, direction.value, adjustments.value, !dateEnabled.value)
  if (!traversed) return { start, calendarResult, final: calendarResult, durationMs, events: [], unresolved:true }
  return { start, calendarResult, final: new Date(traversed.result), durationMs, events: traversed.events, unresolved:false }
})
const finalText = computed(() => {
  const final=calculation.value?.final
  if(!final) return ''
  if(dateEnabled.value && timeEnabled.value) return formatDateTime(final)
  if(dateEnabled.value) return `${final.getFullYear()}-${String(final.getMonth()+1).padStart(2,'0')}-${String(final.getDate()).padStart(2,'0')}`
  return `${String(final.getHours()).padStart(2,'0')}:${String(final.getMinutes()).padStart(2,'0')}:${String(final.getSeconds()).padStart(2,'0')}`
})
const calendarText = computed(() => {
  if (!dateEnabled.value) return ''
  const parts:string[]=[]; const verb=direction.value==='add'?t.value('timeAdd.addVerb'):t.value('timeAdd.subtractVerb')
  if(amount('years')) parts.push(`${verb}${amount('years')}${t.value('timeAdd.year')}`)
  if(amount('months')) parts.push(`${verb}${amount('months')}${t.value('timeAdd.month')}`)
  if(amount('days')) parts.push(`${verb}${amount('days')}${t.value('timeAdd.day')}`)
  return parts.join('，')
})
const durationText = computed(() => {
  if (!timeEnabled.value) return ''
  const parts:string[]=[]
  if(amount('hours')) parts.push(`${amount('hours')}${t.value('timeAdd.hour')}`)
  if(amount('minutes')) parts.push(`${amount('minutes')}${t.value('timeAdd.minute')}`)
  if(amount('seconds')) parts.push(`${amount('seconds')}${t.value('timeAdd.second')}`)
  return parts.join(' ')
})
function formatDateTime(value: Date) { return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')} ${String(value.getHours()).padStart(2,'0')}:${String(value.getMinutes()).padStart(2,'0')}:${String(value.getSeconds()).padStart(2,'0')}` }
function formatClock(value:number){const date=new Date(value);return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`}
function eventDuration(ms:number){let seconds=Math.round(ms/1000);const hours=Math.floor(seconds/3600);seconds%=3600;const minutes=Math.floor(seconds/60);seconds%=60;return `${hours?`${hours}${t.value('timeAdd.hour')}`:''}${minutes?`${minutes}${t.value('timeAdd.minute')}`:''}${seconds?`${seconds}${t.value('timeAdd.second')}`:''}`||`0${t.value('timeAdd.second')}`}
function eventText(event: TraversalEvent) {
  if (!dateEnabled.value) return event.type==='skip' ? `${event.start!==undefined&&event.end!==undefined?`${formatClock(event.start)}→${formatClock(event.end)}：`:''}${t.value('timeAdd.skippedStandardDay')}（${reasonText(event.reason)}）` : `${formatClock(event.start)}→${formatClock(event.end)}：${eventDuration(event.ms)}`
  if(event.type==='skip') return `${eventDate(event.day)}${event.start!==undefined&&event.end!==undefined?` ${formatClock(event.start)}→${formatClock(event.end)}`:''}：${t.value('timeAdd.skipped')}（${reasonText(event.reason)}）`
  return `${eventDate(event.start)} ${formatClock(event.start)}→${formatClock(event.end)}：${eventDuration(event.ms)}`
}
function eventDate(value:number){const date=new Date(value);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function restoreSchedule() { if (window.confirm(t.value('settings.restoreConfirm'))) restoreDefaultWorkSchedule() }
function reasonText(reason:NonWorkingReason|null){return reason?t.value(`timeDifference.reason.${reason}`):t.value('timeDifference.reason.nonWorking')}
const landingReason = computed(() => {const value=calculation.value;if(!value?.final||mode.value!=='company'||!timeEnabled.value)return '';if(value.unresolved)return t.value('timeAdd.unresolvedWork');if(value.durationMs===0){const reason=nonWorkingReasonAt(value.final.getTime(),adjustments.value,!dateEnabled.value);return reason?`${t.value('timeAdd.notCounted')}：${reasonText(reason)}`:''}return ''})
function selectInput(event:FocusEvent){(event.target as HTMLInputElement).select()}
function resetAll(){startDate.value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;startTime.value='';dateEnabled.value=true;timeEnabled.value=true;direction.value='add';mode.value='company';fields.forEach(key=>amounts[key]='');adjustments.value=[]}
</script>

<template>
  <main class="page time-add-page" :class="`mode-${mode}`" @pointerdown="dismissKeyboard">
    <section class="add-start-card">
      <div class="add-start-head"><h2>{{ t('timeAdd.startPoint') }}</h2><button type="button" class="page-reset-button" @click="resetAll">↻ {{ t('timeDifference.reset') }}</button></div>
      <div class="scope-switches"><button type="button" :class="{active:dateEnabled}" @click="togglePart('date')"><span>{{ t('timeAdd.dateSwitch') }}</span><b>{{ dateEnabled ? '✓' : '○' }}</b></button><button type="button" :class="{active:timeEnabled}" @click="togglePart('time')"><span>{{ t('timeAdd.timeSwitch') }}</span><b>{{ timeEnabled ? '✓' : '○' }}</b></button></div>
      <div class="add-start-grid" :class="{single:!(dateEnabled&&timeEnabled)}"><NativeDateTimeControl v-if="dateEnabled" v-model="startDate" type="date" :label="t('timeDifference.date')"/><NativeDateTimeControl v-if="timeEnabled" v-model="startTime" type="time" :label="t('timeDifference.time')"/></div>
    </section>

    <section class="add-operation-card">
      <div class="direction-segments"><button type="button" :class="{active:direction==='add'}" @click="direction='add'">＋ {{ t('timeAdd.add') }}</button><button type="button" :class="{active:direction==='subtract'}" @click="direction='subtract'">− {{ t('timeAdd.subtract') }}</button></div>
      <div class="duration-grid" @keydown="durationKeydown">
        <label v-for="(key,index) in visibleFields" :key="key"><span>{{ t(`timeAdd.${key}`) }}</span><input :value="amounts[key]" type="text" inputmode="numeric" pattern="[0-9]*" :enterkeyhint="index===visibleFields.length-1?'done':'next'" @focus="selectInput" @click="selectInput" @input="sanitize(key,$event)"></label>
      </div>
    </section>

    <section v-if="timeEnabled" class="add-mode-card">
      <p>{{ t('timeAdd.modeHint') }}</p>
      <div class="mode-segments"><button type="button" :class="{active:mode==='company'}" @click="mode='company'">{{ t('timeDifference.company') }}</button><button type="button" :class="{active:mode==='natural'}" @click="mode='natural'">{{ t('timeDifference.natural') }}</button></div>
    </section>

    <section class="add-result-card">
      <h2>{{ t('timeAdd.result') }}</h2>
      <p v-if="!calculation" class="add-waiting">{{ t('timeAdd.waiting') }}</p>
      <template v-else-if="calculation.final">
        <strong class="final-date-time">{{ finalText }}</strong>
        <p v-if="landingReason" class="landing-warning">{{ landingReason }}</p>
        <div class="add-process"><h3>{{ t('timeAdd.process') }}</h3><p v-if="calendarText">{{ t('timeAdd.first') }}{{ calendarText }}</p><p v-if="durationText"><template v-if="mode==='natural'">{{ calendarText ? t('timeAdd.then') : '' }}{{ t('timeAdd.naturalDirect') }}{{ direction==='add'?t('timeAdd.addVerb'):t('timeAdd.subtractVerb') }}{{ durationText }}</template><template v-else>{{ calendarText ? t('timeAdd.then') : '' }}{{ direction==='add'?t('timeAdd.addVerb'):t('timeAdd.subtractVerb') }}{{ durationText }}{{ t('timeAdd.workingSuffix') }}</template></p><div v-if="mode==='company' && calculation.events.length" class="work-events"><span v-for="(event,index) in calculation.events" :key="index">{{ eventText(event) }}</span></div></div>
      </template>
      <p v-else class="add-error">{{ t('timeAdd.noWorkingTime') }}</p>
    </section>

    <SpecialAdjustmentsPanel v-if="dateEnabled && timeEnabled && mode==='company'" v-model="adjustments" />
    <section v-if="timeEnabled && mode==='company'" class="schedule-summary-card"><WorkScheduleSummary :schedule="workSchedule" :show-title="true"/><div class="schedule-settings-actions"><RouterLink to="/settings/work-schedule">{{ t('settings.modify') }}</RouterLink><button type="button" @click="restoreSchedule">{{ t('settings.restore') }}</button></div></section>
  </main>
</template>
