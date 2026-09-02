import { workSchedule, type DayRule, type WorkSchedule } from './workSchedule'

export type Interval = { start: number; end: number }
export type SpecialAdjustment = { id: number; type: 'rest' | 'work'; start: string; end: string }

export function timeOnDay(day: Date, value: string) {
  const [hour, minute] = value.split(':').map(Number)
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, 0, 0).getTime()
}

export function mergeIntervals(intervals: Interval[]) {
  const sorted = intervals.filter(item => item.end > item.start).sort((a, b) => a.start - b.start)
  const merged: Interval[] = []
  for (const item of sorted) {
    const last = merged[merged.length - 1]
    if (!last || item.start > last.end) merged.push({ ...item })
    else last.end = Math.max(last.end, item.end)
  }
  return merged
}

function subtractOne(source: Interval[], cut: Interval) {
  const output: Interval[] = []
  for (const item of source) {
    if (cut.end <= item.start || cut.start >= item.end) output.push(item)
    else {
      if (cut.start > item.start) output.push({ start: item.start, end: Math.min(cut.start, item.end) })
      if (cut.end < item.end) output.push({ start: Math.max(cut.end, item.start), end: item.end })
    }
  }
  return output
}

function subtractMany(source: Interval[], cuts: Interval[]) {
  return cuts.reduce((current, cut) => subtractOne(current, cut), source)
}

function milliseconds(intervals: Interval[]) { return intervals.reduce((sum, item) => sum + item.end - item.start, 0) }

export function dayRuleFor(date: Date, schedule: WorkSchedule): DayRule | null {
  const weekday = date.getDay()
  const fixed = schedule.fixedDates.find(rule => rule.enabled && Number(rule.day) === date.getDate())
  if (fixed) {
    if (weekday === 0 && fixed.sundayOff) return null
    return fixed
  }
  return weekday === 0 ? schedule.sunday : weekday === 6 ? schedule.saturday : schedule.weekday
}

export type NonWorkingReason = 'specialRest' | 'sunday' | 'restDay' | 'lunch' | 'beforeWork' | 'afterWork'
export function nonWorkingReasons(start: number, end: number, adjustments: SpecialAdjustment[], ignoreFixedDates = false): NonWorkingReason[] {
  const reasons = new Set<NonWorkingReason>()
  const specialRests = adjustmentIntervals(adjustments, 'rest', start, end)
  if (specialRests.some(item => item.end > start && item.start < end)) reasons.add('specialRest')
  const cursor = new Date(start); cursor.setHours(0,0,0,0)
  const last = new Date(Math.max(start,end-1)); last.setHours(0,0,0,0)
  while (cursor.getTime() <= last.getTime()) {
    const dayStart=cursor.getTime(), next=new Date(cursor); next.setDate(next.getDate()+1); const dayEnd=next.getTime()
    const partStart=Math.max(start,dayStart), partEnd=Math.min(end,dayEnd)
    const rule=ignoreFixedDates ? workSchedule.value.weekday : dayRuleFor(cursor,workSchedule.value)
    if (!rule?.enabled) reasons.add(cursor.getDay()===0?'sunday':'restDay')
    else {
      const workStart=timeOnDay(cursor,rule.start), workEnd=timeOnDay(cursor,rule.end)
      if(partStart<workStart) reasons.add('beforeWork')
      if(partEnd>workEnd) reasons.add('afterWork')
      if(workSchedule.value.lunch.enabled){const lunchStart=timeOnDay(cursor,workSchedule.value.lunch.start),lunchEnd=timeOnDay(cursor,workSchedule.value.lunch.end);if(partStart<lunchEnd&&partEnd>lunchStart) reasons.add('lunch')}
    }
    cursor.setDate(cursor.getDate()+1)
  }
  return [...reasons]
}

export function nonWorkingReasonAt(value:number, adjustments:SpecialAdjustment[], ignoreFixedDates=false) {
  return nonWorkingReasons(value,value+1000,adjustments,ignoreFixedDates)[0] ?? null
}

export function scheduledIntervals(start: number, end: number, schedule = workSchedule.value, ignoreFixedDates = false) {
  const intervals: Interval[] = []
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)
  while (cursor.getTime() <= last.getTime()) {
    const rule = ignoreFixedDates ? schedule.weekday : dayRuleFor(cursor, schedule)
    if (rule?.enabled) {
      const daily = [{ start: Math.max(start, timeOnDay(cursor, rule.start)), end: Math.min(end, timeOnDay(cursor, rule.end)) }]
      const withLunchRemoved = schedule.lunch.enabled ? subtractOne(daily, { start: timeOnDay(cursor, schedule.lunch.start), end: timeOnDay(cursor, schedule.lunch.end) }) : daily
      intervals.push(...withLunchRemoved.filter(interval => interval.end > interval.start))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return mergeIntervals(intervals)
}

function adjustmentIntervals(items: SpecialAdjustment[], type: SpecialAdjustment['type'], start: number, end: number) {
  return mergeIntervals(items.filter(item => item.type === type && item.start && item.end).map(item => ({
    start: Math.max(start, new Date(item.start).getTime()), end: Math.min(end, new Date(item.end).getTime())
  })).filter(item => Number.isFinite(item.start) && Number.isFinite(item.end) && item.end > item.start))
}

export function effectiveWorkIntervals(start: number, end: number, adjustments: SpecialAdjustment[], ignoreFixedDates = false) {
  const baseline = scheduledIntervals(start, end, workSchedule.value, ignoreFixedDates)
  const rests = adjustmentIntervals(adjustments, 'rest', start, end)
  const specialWork = adjustmentIntervals(adjustments, 'work', start, end)
  const afterRest = subtractMany(baseline, rests)
  const workOutsideOriginalSchedule = subtractMany(specialWork, baseline)
  return mergeIntervals([...afterRest, ...workOutsideOriginalSchedule])
}

export function calculateCompanyTime(start: number, end: number, adjustments: SpecialAdjustment[], ignoreFixedDates = false) {
  const naturalMs = Math.max(0, end - start)
  if (!naturalMs) return { naturalMs: 0, effectiveMs: 0, deductedMs: 0, deductionIntervals: [] as Interval[] }
  const effectiveIntervals = effectiveWorkIntervals(start, end, adjustments, ignoreFixedDates)
  const effectiveMs = Math.min(naturalMs, milliseconds(effectiveIntervals))
  const deductionIntervals = subtractMany([{ start, end }], effectiveIntervals)
  return { naturalMs, effectiveMs, deductedMs: Math.max(0, naturalMs - effectiveMs), deductionIntervals }
}

export function parseLocal(date: string, time: string) {
  if (!date || !time) return null
  const value = new Date(`${date}T${time}:00`).getTime()
  return Number.isFinite(value) ? value : null
}
