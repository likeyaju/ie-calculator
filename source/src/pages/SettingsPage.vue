<script setup lang="ts">
import { t } from '../i18n'
import WorkScheduleSummary from '../components/WorkScheduleSummary.vue'
import { restoreDefaultWorkSchedule, workSchedule } from '../logic/workSchedule'
import { colorHintsEnabled, setColorHints } from '../logic/uiPreferences'
import CopyrightNotice from '../components/CopyrightNotice.vue'

function restoreDefaults() {
  if (window.confirm(t.value('settings.restoreConfirm'))) restoreDefaultWorkSchedule()
}
</script>

<template>
  <main class="page settings-page">
    <section class="settings-heading"><h1>{{ t('settings.title') }}</h1><p>{{ t('settings.intro') }}</p></section>
    <section class="settings-card">
      <div class="preference-row"><div><h2>{{t('settings.colorHints')}}</h2><p>{{t('settings.colorHintsHint')}}</p></div><label class="preference-switch"><input type="checkbox" :checked="colorHintsEnabled" @change="setColorHints(($event.target as HTMLInputElement).checked)"><span></span><b>{{colorHintsEnabled?t('settings.enabled'):t('settings.disabled')}}</b></label></div>
    </section>
    <section class="settings-card">
      <div class="settings-card-head"><div><h2>{{ t('settings.workTime') }}</h2><p>{{ t('settings.sharedHint') }}</p></div></div>
      <WorkScheduleSummary :schedule="workSchedule" :show-title="true" />
      <div class="settings-actions"><RouterLink to="/settings/work-schedule">{{ t('settings.modify') }}</RouterLink><button type="button" @click="restoreDefaults">{{ t('settings.restore') }}</button></div>
    </section>
    <CopyrightNotice />
  </main>
</template>
