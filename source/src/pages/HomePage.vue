<script setup lang="ts">import { t } from '../i18n'; import ToolCard from '../components/ToolCard.vue'; import CopyrightNotice from '../components/CopyrightNotice.vue'</script>
<template><div class="page home-page">
  <section class="home-intro"><span class="eyebrow">{{t('home.eyebrow')}}</span><h1>{{t('home.greeting')}}</h1><p>{{t('home.description')}}</p></section>
  <section><div class="section-heading"><span>{{t('home.core')}}</span><i></i></div><ToolCard to="/bottleneck-ct" featured icon="bottleneck" :title="t('home.bottleneck.title')" :description="t('home.bottleneck.desc')" :action="t('home.bottleneck.action')"/></section>
  <section><div class="section-heading"><span>{{t('home.frequent')}}</span><i></i></div><ToolCard to="/enhanced-calculator" icon="calculator" :title="t('home.calculator.title')" :description="t('home.calculator.desc')"/></section>
  <section><div class="section-heading"><span>{{t('home.allTools')}}</span><i></i></div><div class="tool-grid"><ToolCard to="/production-tools" icon="efficiency" :title="t('home.efficiency.title')" :description="t('home.efficiency.desc')"/><ToolCard to="/ct-tools" icon="ct" :title="t('home.ctCapacity.title')" :description="t('home.ctCapacity.desc')"/><ToolCard to="/time-tools" icon="time" :title="t('home.time.title')" :description="t('home.time.desc')"/><ToolCard to="/average-sum" icon="average" :title="t('home.average.title')" :description="t('home.average.desc')"/></div></section>
  <CopyrightNotice />
</div></template>
