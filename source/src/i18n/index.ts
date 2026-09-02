import { computed, ref } from 'vue'
import zh from './zh'
import en from './en'
import km from './km'
import { detectSystemLocale } from './detectSystemLocale'
export { detectSystemLocale } from './detectSystemLocale'

export type Locale = 'zh' | 'en' | 'km' | 'kmzh'
const dictionaries: Record<Exclude<Locale, 'kmzh'>, Record<string, unknown>> = { zh, en, km }
const savedLocale = localStorage.getItem('ie-language') as Locale | null
const supportedLocales: Locale[] = ['zh', 'en', 'km', 'kmzh']

const initialLocale: Locale = savedLocale && supportedLocales.includes(savedLocale)
  ? savedLocale
  : detectSystemLocale(navigator.languages?.[0] || navigator.language || 'en')
export const locale = ref<Locale>(initialLocale)
export const shouldAutoOpenLanguageMenu = !localStorage.getItem('ie-language-menu-shown')
document.documentElement.dataset.locale = locale.value
document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : locale.value === 'en' ? 'en' : 'km'

function lookup(source: Record<string, unknown>, path: string): string | undefined {
  let value: unknown = source
  for (const key of path.split('.')) value = typeof value === 'object' && value ? (value as Record<string, unknown>)[key] : undefined
  return typeof value === 'string' ? value : undefined
}

export const t = computed(() => (key: string) => {
  const chinese = lookup(zh as unknown as Record<string, unknown>, key)
  if (locale.value === 'kmzh') {
    const khmer = lookup(km as unknown as Record<string, unknown>, key)
    return khmer && chinese && khmer !== chinese ? `${khmer}\n${chinese}` : chinese ?? khmer ?? key
  }
  return lookup(dictionaries[locale.value], key) ?? chinese ?? key
})
export function setLocale(value: Locale) { locale.value = value; localStorage.setItem('ie-language', value); document.documentElement.lang = value === 'zh' ? 'zh-CN' : value === 'en' ? 'en' : 'km';document.documentElement.dataset.locale=value }
export function markLanguageMenuShown() { localStorage.setItem('ie-language-menu-shown', '1') }
