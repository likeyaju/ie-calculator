<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { t } from '../i18n'
import { cloneWorkSchedule, saveWorkSchedule, validateWorkSchedule, workSchedule, type DayRule, type FixedDateRule } from '../logic/workSchedule'

const router = useRouter()
const draft = reactive(cloneWorkSchedule(workSchedule.value))
const initialDraft = JSON.stringify(draft)
const fixedEditor = ref<HTMLElement|null>(null)
let saved = false
let nextId = Math.max(0, ...draft.fixedDates.map(rule => rule.id)) + 1
const validation = computed(() => validateWorkSchedule(draft))
const errorText = computed(() => validation.value ? t.value(`settings.errors.${validation.value}`) : '')

const dayRows = computed<Array<{ key: 'weekday' | 'saturday' | 'sunday'; label: string; rule: DayRule }>>(() => [
  { key: 'weekday', label: t.value('settings.weekday'), rule: draft.weekday },
  { key: 'saturday', label: t.value('settings.saturday'), rule: draft.saturday },
  { key: 'sunday', label: t.value('settings.sunday'), rule: draft.sunday }
])

function addFixedDate() { if(draft.fixedDates.length>=10)return;draft.fixedDates.push({ id: nextId++, enabled: true, day: 1, start: '07:00', end: '16:00', sundayOff: true });nextTick(()=>fixedEditor.value?.querySelector<HTMLElement>('.fixed-rule:last-of-type')?.scrollIntoView({behavior:'smooth',block:'center'})) }
function removeFixedDate(id: number) { if(window.confirm(t.value('settings.deleteConfirm')))draft.fixedDates = draft.fixedDates.filter(rule => rule.id !== id) }
function updateDay(rule:FixedDateRule,event:Event){const input=event.target as HTMLInputElement,clean=input.value.replace(/\D/g,'').slice(0,2);if(clean!==input.value)input.value=clean;rule.day=clean===''?0:Number(clean)}
function save() { if (!saveWorkSchedule(draft)){saved=true;router.push('/settings')} }
onBeforeRouteLeave(()=>{if(!saved&&JSON.stringify(draft)!==initialDraft&&!window.confirm(t.value('settings.unsavedConfirm')))return false})
</script>

<template>
  <main class="page work-schedule-page">
    <section class="settings-heading"><h1>{{ t('settings.modifyTitle') }}</h1><p>{{ t('settings.modifyIntro') }}</p></section>

    <section class="schedule-editor-card">
      <h2>{{ t('settings.weeklyRules') }}</h2>
      <article v-for="row in dayRows" :key="row.key" class="schedule-rule-row">
        <div class="rule-heading"><strong>{{ row.label }}</strong><label class="rule-switch"><input v-model="row.rule.enabled" type="checkbox"><span>{{ row.rule.enabled ? t('settings.working') : t('settings.rest') }}</span></label></div>
        <div class="rule-times" :class="{disabled:!row.rule.enabled}"><label><span>{{ t('settings.startWork') }}</span><input v-model="row.rule.start" type="time" :disabled="!row.rule.enabled"></label><label><span>{{ t('settings.endWork') }}</span><input v-model="row.rule.end" type="time" :disabled="!row.rule.enabled"></label></div>
      </article>
    </section>

    <section class="schedule-editor-card">
      <div class="rule-heading"><strong>{{ t('settings.lunch') }}</strong><label class="rule-switch"><input v-model="draft.lunch.enabled" type="checkbox"><span>{{ draft.lunch.enabled ? t('settings.enabled') : t('settings.disabled') }}</span></label></div>
      <div class="rule-times" :class="{disabled:!draft.lunch.enabled}"><label><span>{{ t('settings.lunchStart') }}</span><input v-model="draft.lunch.start" type="time" :disabled="!draft.lunch.enabled"></label><label><span>{{ t('settings.lunchEnd') }}</span><input v-model="draft.lunch.end" type="time" :disabled="!draft.lunch.enabled"></label></div>
    </section>

    <section ref="fixedEditor" class="schedule-editor-card fixed-date-editor">
      <div class="fixed-title"><div><h2>{{ t('settings.fixedDates') }}</h2><p>{{ t('settings.fixedHint') }}</p></div><button type="button" :disabled="draft.fixedDates.length>=10" @click="addFixedDate">＋ {{ t('settings.addFixed') }}</button></div>
      <article v-for="(rule,index) in draft.fixedDates" :key="rule.id" class="fixed-rule">
        <div class="rule-heading"><strong>{{ t('settings.fixedRule') }} {{ index+1 }}</strong><label class="rule-switch"><input v-model="rule.enabled" type="checkbox"><span>{{ rule.enabled ? t('settings.enabled') : t('settings.disabled') }}</span></label></div>
        <div class="fixed-fields" :class="{disabled:!rule.enabled}"><label><span>{{ t('settings.monthDay') }}</span><input type="text" inputmode="numeric" :value="rule.day||''" @input="updateDay(rule,$event)"></label><label><span>{{ t('settings.startWork') }}</span><input v-model="rule.start" type="time"></label><label><span>{{ t('settings.endWork') }}</span><input v-model="rule.end" type="time"></label></div>
        <label class="sunday-option"><input v-model="rule.sundayOff" type="checkbox"><span>{{ t('settings.sundayOffRule') }}</span></label>
        <button type="button" class="delete-fixed" @click="removeFixedDate(rule.id)">{{ t('settings.delete') }}</button>
      </article>
      <p v-if="errorText" class="schedule-error">{{ errorText }}</p>
    </section>

    <div class="schedule-save-bar"><button type="button" :disabled="!!validation" @click="save">{{ t('settings.save') }}</button></div>
  </main>
</template>
