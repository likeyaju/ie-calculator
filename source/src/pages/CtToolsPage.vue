<script setup lang="ts">
import { t } from '../i18n'
import ToolCard from '../components/ToolCard.vue'
</script>
<template><div class="page tool-index-page">
  <section class="page-intro"><h1>{{ t('ctTools.title') }}</h1><p>{{ t('ctTools.intro') }}</p></section>
  <div class="tool-index-list">
    <ToolCard to="/ct-capacity" icon="ct" :title="t('ctCapacity.title')" :description="t('ctCapacity.intro')" />
    <ToolCard to="/takt-time" icon="ct" :title="t('taktTime.title')" :description="t('taktTime.intro')" />
    <ToolCard to="/line-balance" icon="ct" :title="t('lineBalance.title')" :description="t('lineBalance.intro')" />
  </div>
</div></template>
