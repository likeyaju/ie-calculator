<script setup lang="ts">
import ToolIcon from './ToolIcon.vue'
defineProps<{ title: string; description: string; icon: string; to?: string; featured?: boolean; action?: string }>()
</script>
<template><component :is="to ? 'RouterLink' : 'button'" :to="to" class="tool-card" :class="{ featured, disabled: !to }"><ToolIcon :name="icon"/><span class="tool-copy"><strong>{{ title }}</strong><small>{{ description }}</small></span><span v-if="action" class="tool-action">{{ action }} <span>→</span></span><span v-else class="tool-chevron">›</span></component></template>
