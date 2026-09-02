<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { t } from '../i18n'
import { calculateCompanyTime, nonWorkingReasons, parseLocal, type NonWorkingReason, type SpecialAdjustment } from '../logic/timeDifference'
import { restoreDefaultWorkSchedule, workSchedule } from '../logic/workSchedule'
import WorkScheduleSummary from '../components/WorkScheduleSummary.vue'
import NativeDateTimeControl from '../components/NativeDateTimeControl.vue'
import SpecialAdjustmentsPanel from '../components/SpecialAdjustmentsPanel.vue'

type Mode = 'company' | 'natural'
const mode = ref<Mode>('company')
const dateEnabled = ref(false)
const timeEnabled = ref(true)
const timeFormat = ref<'24'|'12'>('24')
const today = new Date()
const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const startDate = ref(localToday)
const endDate = ref(localToday)
const startTime = ref('')
const endTime = ref('')
const overnightConfirmed = ref(false)
const overnightDismissed = ref(false)
const deductionDetailsOpen = ref(false)
const adjustments = ref<SpecialAdjustment[]>([])

watch([startTime, endTime, dateEnabled, timeEnabled], () => { overnightConfirmed.value = false; overnightDismissed.value = false })

function togglePart(part:'date'|'time') {
  if (part==='date') { if (dateEnabled.value && !timeEnabled.value) return; dateEnabled.value=!dateEnabled.value }
  else { if (timeEnabled.value && !dateEnabled.value) return; timeEnabled.value=!timeEnabled.value }
}

const needsOvernightChoice = computed(() => !dateEnabled.value && timeEnabled.value && !!startTime.value && !!endTime.value && endTime.value < startTime.value && !overnightConfirmed.value && !overnightDismissed.value)
const timeRange = computed(() => {
  if ((dateEnabled.value && (!startDate.value || !endDate.value)) || (timeEnabled.value && (!startTime.value || !endTime.value))) return null
  const calculationDate = dateEnabled.value ? startDate.value : '2000-01-03'
  const start = parseLocal(calculationDate, timeEnabled.value ? startTime.value : '00:00')
  let end = parseLocal(dateEnabled.value ? endDate.value : calculationDate, timeEnabled.value ? endTime.value : '00:00')
  if (start === null || end === null) return null
  if (!dateEnabled.value && end < start) {
    if (!overnightConfirmed.value) return null
    end += 86400000
  }
  return { start, end }
})
const resultSign = computed(() => !timeRange.value || timeRange.value.end >= timeRange.value.start ? 1 : -1)
const result = computed(() => {
  const range = timeRange.value
  if (!range) return null
  if (dateEnabled.value && !timeEnabled.value) {
    const naturalMs=Math.abs(range.end-range.start)
    return { naturalMs, effectiveMs:naturalMs, deductedMs:0, deductionIntervals:[] }
  }
  const start=Math.min(range.start,range.end), end=Math.max(range.start,range.end)
  if (mode.value === 'natural') {
    const naturalMs = end-start
    return { naturalMs, effectiveMs: naturalMs, deductedMs: 0, deductionIntervals: [] }
  }
  return calculateCompanyTime(start, end, adjustments.value, !dateEnabled.value)
})
const totalSeconds = computed(() => result.value ? Math.floor(result.value.effectiveMs / 1000) : null)
const totalMinutes = computed(() => totalSeconds.value === null ? null : totalSeconds.value / 60)
const totalHours = computed(() => totalSeconds.value === null ? null : totalSeconds.value / 3600)
const longNaturalSpan = computed(() => mode.value === 'natural' && !!result.value && result.value.naturalMs > 172800000)
const signedPrefix = computed(() => resultSign.value > 0 ? '+' : '−')
const resultTone = computed(() => resultSign.value > 0 ? 'positive' : 'negative')
function trim(value:number,digits=2){return Number(value.toFixed(digits)).toString()}
const timeFormats = computed(() => {
  if (!result.value || dateEnabled.value || !timeEnabled.value) return []
  const total=Math.floor(result.value.effectiveMs/1000), hours=Math.floor(total/3600), minutes=Math.floor(total%3600/60), seconds=total%60
  const combined=`${hours}${t.value('timeDifference.hourUnit')}${minutes}${t.value('timeDifference.minuteUnit')}${seconds?`${seconds}${t.value('timeDifference.secondUnit')}`:''}`
  const clockText=`${hours}:${String(minutes).padStart(2,'0')}${seconds?`:${String(seconds).padStart(2,'0')}`:''}`
  return [combined,clockText,`${trim(total/3600)}${t.value('timeDifference.hourUnit')}`,`${trim(total/60,1)}${t.value('timeDifference.minuteUnit')}`,`${total}${t.value('timeDifference.secondUnit')}`]
})
function calendarParts(startMs:number,endMs:number){
  let start=new Date(Math.min(startMs,endMs)), end=new Date(Math.max(startMs,endMs)); let years=end.getFullYear()-start.getFullYear(), months=end.getMonth()-start.getMonth(), days=end.getDate()-start.getDate()
  if(days<0){months--;days+=new Date(end.getFullYear(),end.getMonth(),0).getDate()}
  if(months<0){years--;months+=12}
  return {years,months,days}
}
const dateFormats = computed(() => {
  if (!result.value || !dateEnabled.value || timeEnabled.value || !timeRange.value) return []
  const {years,months,days}=calendarParts(timeRange.value.start,timeRange.value.end)
  const totalDays=Math.round(result.value.effectiveMs/86400000), weeks=Math.floor(totalDays/7)
  return [`${years}${t.value('timeDifference.yearUnit')}${months}${t.value('timeDifference.monthUnit')}${days}${t.value('timeDifference.dayUnit')}`,`${totalDays}${t.value('timeDifference.dayUnit')}`,`${weeks}${t.value('timeDifference.weekUnit')}${totalDays%7}${t.value('timeDifference.dayUnit')}`]
})

function duration(ms: number, includeDays = false) {
  let seconds = Math.floor(ms / 1000)
  const days = Math.floor(seconds / 86400); seconds %= 86400
  const hours = Math.floor(seconds / 3600); seconds %= 3600
  const minutes = Math.floor(seconds / 60); seconds %= 60
  const dayText = includeDays && days ? `${days}${t.value('timeDifference.dayUnit')}` : ''
  const displayedHours = includeDays ? hours : hours + days * 24
  return `${dayText}${displayedHours}${t.value('timeDifference.hourUnit')}${minutes}${t.value('timeDifference.minuteUnit')}${seconds}${t.value('timeDifference.secondUnit')}`
}
function confirmNextDay() { overnightConfirmed.value = true }
function returnToEdit() { overnightDismissed.value = true }
function restoreSchedule() { if (window.confirm(t.value('settings.restoreConfirm'))) restoreDefaultWorkSchedule() }
function resetAll() { startDate.value=localToday;endDate.value=localToday;startTime.value='';endTime.value='';dateEnabled.value=false;timeEnabled.value=true;timeFormat.value='24';mode.value='company';adjustments.value=[];deductionDetailsOpen.value=false;overnightConfirmed.value=false;overnightDismissed.value=false }
function reasonText(reason:NonWorkingReason){return t.value(`timeDifference.reason.${reason}`)}
function deductionReason(start:number,end:number){const reasons=nonWorkingReasons(start,end,adjustments.value,!dateEnabled.value);return reasons.length?reasons.map(reasonText).join('、'):t.value('timeDifference.reason.nonWorking')}
function clock(value: number) { const date = new Date(value); return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}` }
function detailRange(start: number, end: number) {
  if (!dateEnabled.value) return `${clock(start)}–${clock(end)}`
  const dateTime = (value: number) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${clock(value)}` }
  return `${dateTime(start)} → ${dateTime(end)}`
}
</script>

<template>
  <main class="page time-difference-page" :class="`mode-${mode}`">
    <section v-if="timeEnabled" class="difference-mode-card">
      <div class="mode-segments" role="tablist">
        <button type="button" :class="{active:mode==='company'}" @click="mode='company'">{{ t('timeDifference.company') }}</button>
        <button type="button" :class="{active:mode==='natural'}" @click="mode='natural'">{{ t('timeDifference.natural') }}</button>
      </div>
    </section>

    <section class="difference-input-card">
      <div class="difference-input-head">
        <h2>{{ t('timeDifference.start') }}／{{ t('timeDifference.end') }}</h2>
        <div class="difference-head-actions"><div v-if="timeEnabled" class="clock-format-toggle"><button type="button" :class="{active:timeFormat==='24'}" @click="timeFormat='24'">24H</button><button type="button" :class="{active:timeFormat==='12'}" @click="timeFormat='12'">12H</button></div><button type="button" class="page-reset-button" @click="resetAll">↻ {{ t('timeDifference.reset') }}</button></div>
      </div>
      <div class="scope-switches"><button type="button" :class="{active:dateEnabled}" @click="togglePart('date')"><span>{{ t('timeAdd.dateSwitch') }}</span><b>{{ dateEnabled?'✓':'○' }}</b></button><button type="button" :class="{active:timeEnabled}" @click="togglePart('time')"><span>{{ t('timeAdd.timeSwitch') }}</span><b>{{ timeEnabled?'✓':'○' }}</b></button></div>
      <div class="timepoint-grid">
        <fieldset>
          <legend>{{ t('timeDifference.start') }}</legend>
          <NativeDateTimeControl v-if="dateEnabled" v-model="startDate" type="date" :label="t('timeDifference.date')" />
          <NativeDateTimeControl v-if="timeEnabled" v-model="startTime" type="time" :label="t('timeDifference.time')" :time-format="timeFormat" />
        </fieldset>
        <fieldset>
          <legend>{{ t('timeDifference.end') }}</legend>
          <NativeDateTimeControl v-if="dateEnabled" v-model="endDate" type="date" :label="t('timeDifference.date')" />
          <NativeDateTimeControl v-if="timeEnabled" v-model="endTime" type="time" :label="t('timeDifference.time')" :time-format="timeFormat" />
        </fieldset>
      </div>
    </section>

    <section class="difference-result-card">
      <h2>{{ t('timeDifference.result') }}</h2>
      <p v-if="!result" class="difference-waiting">{{ t('timeDifference.waiting') }}</p>
      <template v-else>
        <div v-if="timeFormats.length || dateFormats.length" class="difference-multi-formats" :class="resultTone"><strong v-for="value in (timeFormats.length?timeFormats:dateFormats)" :key="value">{{ signedPrefix }}{{ value }}</strong></div>
        <div v-if="timeEnabled" class="duration-results">
          <div><small>{{ t('timeDifference.totalHours') }}</small><strong>{{ totalHours?.toFixed(2) }}</strong></div>
          <div><small>{{ t('timeDifference.totalMinutes') }}</small><strong>{{ totalMinutes?.toFixed(1) }}</strong></div>
          <div><small>{{ t('timeDifference.totalSeconds') }}</small><strong>{{ totalSeconds }}</strong></div>
          <div><small>{{ t('timeDifference.readable') }}</small><strong>{{ duration(result.effectiveMs) }}</strong></div>
          <div v-if="result.effectiveMs>=86400000"><small>{{ t('timeDifference.longReadable') }}</small><strong>{{ duration(result.effectiveMs,true) }}</strong></div>
        </div>
        <p v-if="longNaturalSpan" class="long-span-warning">{{ t('timeDifference.longWarning') }}</p>
        <div v-if="timeEnabled && mode==='company'" class="calculation-process">
          <strong>{{ t('timeDifference.process') }}</strong>
          <div class="process-flow"><span><small>{{ t('timeDifference.naturalElapsed') }}</small><b>{{ duration(result.naturalMs) }}</b></span><button v-if="result.deductedMs>0" type="button" class="deducted" @click="deductionDetailsOpen=!deductionDetailsOpen"><small>{{ t('timeDifference.deducted') }}</small><b>− {{ duration(result.deductedMs) }}</b><em>{{ deductionDetailsOpen ? t('timeDifference.hideDetail') : t('timeDifference.viewDetail') }} ›</em></button></div>
          <div v-if="deductionDetailsOpen && result.deductionIntervals.length" class="deduction-details"><strong>{{ t('timeDifference.deductionDetail') }}</strong><div v-for="(item,index) in result.deductionIntervals" :key="index"><span><small>{{ t('timeDifference.nonWorkingInterval') }} {{ index+1 }}</small><b>{{ detailRange(item.start,item.end) }}</b><i>{{ deductionReason(item.start,item.end) }}</i></span><em>{{ duration(item.end-item.start) }}</em></div></div>
        </div>
      </template>
    </section>

    <SpecialAdjustmentsPanel v-if="dateEnabled && timeEnabled && mode==='company'" v-model="adjustments" />

    <section v-if="timeEnabled && mode==='company'" class="schedule-summary-card">
      <WorkScheduleSummary :schedule="workSchedule" :show-title="true" />
      <div class="schedule-settings-actions"><RouterLink to="/settings/work-schedule">{{ t('settings.modify') }}</RouterLink><button type="button" @click="restoreSchedule">{{ t('settings.restore') }}</button></div>
    </section>

    <div v-if="needsOvernightChoice" class="overnight-backdrop">
      <section class="overnight-dialog" role="dialog" aria-modal="true"><strong>{{ t('timeDifference.overnightQuestion') }}</strong><div><button type="button" class="primary" @click="confirmNextDay">{{ t('timeDifference.nextDay') }}</button><button type="button" @click="returnToEdit">{{ t('timeDifference.returnEdit') }}</button></div></section>
    </div>
  </main>
</template>
