<script setup lang="ts">
import { t } from '../i18n'
</script>

<template>
  <main class="page time-tools-page">
    <section class="page-intro compact-intro">
      <h1>{{ t('timeTools.title') }}</h1>
      <p>{{ t('timeTools.intro') }}</p>
    </section>
    <section class="time-tool-list">
      <RouterLink class="time-tool-entry active" to="/time-conversion">
        <span class="time-tool-mark">↔</span>
        <span><strong>{{ t('timeTools.conversion') }}</strong><small>{{ t('timeTools.conversionDesc') }}</small></span>
        <b>›</b>
      </RouterLink>
      <RouterLink class="time-tool-entry active" to="/time-difference">
        <span class="time-tool-mark">△</span>
        <span><strong>{{ t('timeTools.difference') }}</strong><small>{{ t('timeTools.differenceDesc') }}</small></span>
        <b>›</b>
      </RouterLink>
      <RouterLink class="time-tool-entry active" to="/time-add-subtract">
        <span class="time-tool-mark">±</span>
        <span><strong>{{ t('timeTools.addSubtract') }}</strong><small>{{ t('timeTools.addSubtractDesc') }}</small></span>
        <b>›</b>
      </RouterLink>
    </section>
  </main>
</template>
