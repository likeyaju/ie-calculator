<script setup lang="ts">
import { t } from '../i18n'
import ToolCard from '../components/ToolCard.vue'
</script>
<template><div class="page tool-index-page">
  <section class="page-intro"><h1>{{ t('productionTools.title') }}</h1><p>{{ t('productionTools.intro') }}</p></section>
  <div class="tool-index-list">
    <ToolCard to="/efficiency" icon="efficiency" :title="t('home.efficiency.title')" :description="t('home.efficiency.desc')" />
    <ToolCard to="/target-output" icon="efficiency" :title="t('targetOutput.title')" :description="t('targetOutput.intro')" />
    <ToolCard to="/achievement-rate" icon="efficiency" :title="t('achievement.title')" :description="t('achievement.intro')" />
    <ToolCard to="/theoretical-people" icon="efficiency" :title="t('theoreticalPeople.title')" :description="t('theoreticalPeople.intro')" />
  </div>
</div></template>
