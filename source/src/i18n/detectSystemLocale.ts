export type AutomaticLocale = 'zh' | 'en' | 'km'

export function detectSystemLocale(language: string): AutomaticLocale {
  const normalized = language.trim().toLowerCase()
  if (normalized === 'zh' || normalized.startsWith('zh-')) return 'zh'
  if (normalized === 'km' || normalized.startsWith('km-')) return 'km'
  return 'en'
}
