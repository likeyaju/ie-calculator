<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { locale, markLanguageMenuShown, setLocale, shouldAutoOpenLanguageMenu, t, type Locale } from '../i18n'
const route = useRoute(); const router = useRouter()
const isHome = computed(() => route.path === '/')
const title = computed(() => t.value(String(route.meta.titleKey || 'app.title')))
const menuOpen = ref(shouldAutoOpenLanguageMenu)
const languageRoot = ref<HTMLElement | null>(null)
const options: Array<{value:Locale;flag:string;label:string}> = [
  {value:'zh',flag:'🇨🇳',label:'中文'}, {value:'en',flag:'🇬🇧',label:'English'},
  {value:'km',flag:'🇰🇭',label:'ខ្មែរ'}, {value:'kmzh',flag:'🇰🇭🇨🇳',label:'ខ្មែរ / 中文'}
]
const currentFlag = computed(() => options.find(option => option.value === locale.value)?.flag ?? '🇬🇧')
function chooseLanguage(value: Locale) { setLocale(value); menuOpen.value=false; markLanguageMenuShown() }
function toggleMenu() { menuOpen.value=!menuOpen.value; markLanguageMenuShown() }
function closeFromOutside(event: PointerEvent) { if(menuOpen.value&&!languageRoot.value?.contains(event.target as Node)){menuOpen.value=false;markLanguageMenuShown()} }
function closeFromEscape(event: KeyboardEvent) { if(event.key==='Escape'&&menuOpen.value){menuOpen.value=false;markLanguageMenuShown()} }
onMounted(()=>{if(shouldAutoOpenLanguageMenu)markLanguageMenuShown();document.addEventListener('pointerdown',closeFromOutside);document.addEventListener('keydown',closeFromEscape)})
onBeforeUnmount(()=>{document.removeEventListener('pointerdown',closeFromOutside);document.removeEventListener('keydown',closeFromEscape)})
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <button v-if="!isHome" class="icon-button back-button" :aria-label="t('app.back')" @click="router.back()"><span aria-hidden="true">←</span><span>{{ t('app.back') }}</span></button>
      <RouterLink v-else class="brand" to="/" :aria-label="t('app.home')"><span class="brand-mark">IE</span><span><strong>{{ t('app.title') }}</strong><small>{{ t('app.subtitle') }}</small></span></RouterLink>
      <strong v-if="!isHome" class="page-title">{{ title }}</strong>
      <span class="header-tools"><RouterLink v-if="isHome" class="header-settings" to="/settings" :aria-label="t('settings.title')">⚙</RouterLink><span ref="languageRoot" class="language-picker"><button class="language-trigger" type="button" :aria-label="t('app.language')" :aria-expanded="menuOpen" @click="toggleMenu"><span aria-hidden="true">{{currentFlag}}</span><i aria-hidden="true">⌄</i></button><span v-if="menuOpen" class="language-menu" role="menu"><button v-for="option in options" :key="option.value" type="button" role="menuitemradio" :aria-checked="locale===option.value" :class="{active:locale===option.value}" @click="chooseLanguage(option.value)"><span aria-hidden="true">{{option.flag}}</span><b>{{option.label}}</b></button></span></span></span>
    </div>
  </header>
</template>
