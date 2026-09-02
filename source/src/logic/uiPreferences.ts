import { ref } from 'vue'
const COLOR_KEY = 'ie-color-hints'
export const colorHintsEnabled = ref(localStorage.getItem(COLOR_KEY) !== 'false')
export function setColorHints(enabled: boolean) { colorHintsEnabled.value = enabled; localStorage.setItem(COLOR_KEY, String(enabled)) }
