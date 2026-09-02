import { ref } from 'vue'

export type DayRule = { enabled: boolean; start: string; end: string }
export type FixedDateRule = DayRule & { id: number; day: number; sundayOff: boolean }
export type WorkSchedule = {
  weekday: DayRule
  saturday: DayRule
  sunday: DayRule
  lunch: DayRule
  fixedDates: FixedDateRule[]
}

const STORAGE_KEY = 'ie-work-schedule'

export const defaultWorkSchedule: WorkSchedule = {
  weekday: { enabled: true, start: '07:00', end: '18:00' },
  saturday: { enabled: true, start: '07:00', end: '16:00' },
  sunday: { enabled: false, start: '07:00', end: '16:00' },
  lunch: { enabled: true, start: '11:00', end: '12:00' },
  fixedDates: [{ id: 1, enabled: true, day: 10, start: '07:00', end: '16:00', sundayOff: true }]
}

export function cloneWorkSchedule(value: WorkSchedule = defaultWorkSchedule): WorkSchedule {
  return JSON.parse(JSON.stringify(value)) as WorkSchedule
}

function isDayRule(value: unknown): value is DayRule {
  const rule = value as DayRule
  return !!rule && typeof rule.enabled === 'boolean' && typeof rule.start === 'string' && typeof rule.end === 'string'
}

export function loadWorkSchedule(): WorkSchedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneWorkSchedule()
    const value = JSON.parse(raw) as WorkSchedule
    if (!isDayRule(value.weekday) || !isDayRule(value.saturday) || !isDayRule(value.sunday) || !isDayRule(value.lunch) || !Array.isArray(value.fixedDates)) return cloneWorkSchedule()
    return cloneWorkSchedule(value)
  } catch { return cloneWorkSchedule() }
}

export const workSchedule = ref<WorkSchedule>(loadWorkSchedule())

export type ScheduleValidation = 'weekdayTime' | 'saturdayTime' | 'sundayTime' | 'lunchTime' | 'fixedTime' | 'fixedDay' | 'fixedConflict' | null

export function validateWorkSchedule(value: WorkSchedule): ScheduleValidation {
  if (value.weekday.enabled && value.weekday.start >= value.weekday.end) return 'weekdayTime'
  if (value.saturday.enabled && value.saturday.start >= value.saturday.end) return 'saturdayTime'
  if (value.sunday.enabled && value.sunday.start >= value.sunday.end) return 'sundayTime'
  if (value.lunch.enabled && value.lunch.start >= value.lunch.end) return 'lunchTime'
  for (const rule of value.fixedDates) {
    if (rule.day < 1 || rule.day > 31 || !Number.isInteger(Number(rule.day))) return 'fixedDay'
    if (rule.enabled && rule.start >= rule.end) return 'fixedTime'
  }
  const enabledDays = value.fixedDates.filter(rule => rule.enabled).map(rule => Number(rule.day))
  if (new Set(enabledDays).size !== enabledDays.length) return 'fixedConflict'
  return null
}

export function saveWorkSchedule(value: WorkSchedule) {
  const error = validateWorkSchedule(value)
  if (error) return error
  workSchedule.value = cloneWorkSchedule(value)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workSchedule.value))
  return null
}

export function restoreDefaultWorkSchedule() {
  workSchedule.value = cloneWorkSchedule()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workSchedule.value))
}
