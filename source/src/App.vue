<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { colorHintsEnabled } from './logic/uiPreferences'
function dismissKeyboard(event: PointerEvent) { const target=event.target as HTMLElement;if(!target.closest('input,textarea,select,button,a,[contenteditable="true"]'))(document.activeElement as HTMLElement|null)?.blur?.() }
</script>

<template><div class="app-shell" :class="{'color-hints-off':!colorHintsEnabled}" @pointerdown="dismissKeyboard"><AppHeader /><main><RouterView /></main></div></template>
