<script setup lang="ts">
import { t } from '../i18n'
import type { DayRule, WorkSchedule } from '../logic/workSchedule'
defineProps<{ schedule: WorkSchedule; showTitle?: boolean }>()
function range(rule: DayRule) { return rule.enabled ? `${rule.start}–${rule.end}` : t.value('settings.rest') }
</script>

<template>
  <div class="work-schedule-summary">
    <strong v-if="showTitle !== false">{{ t('settings.currentRules') }}</strong>
    <div><span>{{ t('settings.weekday') }}</span><b>{{ range(schedule.weekday) }}</b></div>
    <div><span>{{ t('settings.saturday') }}</span><b>{{ range(schedule.saturday) }}</b></div>
    <div><span>{{ t('settings.sunday') }}</span><b>{{ range(schedule.sunday) }}</b></div>
    <div><span>{{ t('settings.lunch') }}</span><b>{{ schedule.lunch.enabled ? `${schedule.lunch.start}–${schedule.lunch.end}` : t('settings.disabled') }}</b></div>
    <template v-for="rule in schedule.fixedDates" :key="rule.id">
      <div><span>{{ t('settings.monthlyDay') }} {{ rule.day }}</span><b>{{ rule.enabled ? `${rule.start}–${rule.end}` : t('settings.disabled') }}</b></div>
      <small v-if="rule.enabled && rule.sundayOff">{{ t('settings.sundayOffRule') }}</small>
    </template>
  </div>
</template>
