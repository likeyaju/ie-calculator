import { effectiveWorkIntervals, nonWorkingReasonAt, type NonWorkingReason, type SpecialAdjustment } from './timeDifference'

export type Direction = 'add' | 'subtract'
export type TraversalEvent = { type: 'work'; start: number; end: number; ms: number } | { type: 'skip'; day: number; start?: number; end?: number; reason: NonWorkingReason | null }

export function applyCalendarPart(start: Date, years: number, months: number, days: number, direction: Direction) {
  const sign = direction === 'add' ? 1 : -1
  const result = new Date(start)
  const originalDay = result.getDate()
  const targetMonth = result.getMonth() + sign * months
  const targetYear = result.getFullYear() + sign * years + Math.floor(targetMonth / 12)
  const normalizedMonth = ((targetMonth % 12) + 12) % 12
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
  result.setDate(1)
  result.setFullYear(targetYear, normalizedMonth, Math.min(originalDay, lastDay))
  result.setDate(result.getDate() + sign * days)
  return result
}

function dayStart(value: number) { const date = new Date(value); date.setHours(0, 0, 0, 0); return date.getTime() }

export function traverseWorkingTime(anchor: number, durationMs: number, direction: Direction, adjustments: SpecialAdjustment[], ignoreFixedDates = false) {
  if (durationMs === 0) return { result: anchor, events: [] as TraversalEvent[] }
  let remaining = durationMs
  let cursor = anchor
  const events: TraversalEvent[] = []
  for (let count = 0; count < 36600; count++) {
    let baseDay = dayStart(cursor)
    if (direction === 'subtract' && cursor === baseDay) { const previous = new Date(baseDay); previous.setDate(previous.getDate() - 1); baseDay = previous.getTime() }
    const nextDay = new Date(baseDay); nextDay.setDate(nextDay.getDate() + 1)
    const intervals = effectiveWorkIntervals(baseDay, nextDay.getTime(), adjustments, ignoreFixedDates)
    let usedThisDay = false
    if (direction === 'add') {
      let dayCursor=Math.max(cursor,baseDay)
      for (const interval of intervals) {
        const from = Math.max(cursor, interval.start)
        if (interval.end <= from) continue
        if(from>dayCursor) events.push({type:'skip',day:baseDay,start:dayCursor,end:from,reason:nonWorkingReasonAt(dayCursor+(from-dayCursor)/2,adjustments,ignoreFixedDates)})
        const available = interval.end - from
        const used = Math.min(remaining, available)
        events.push({ type: 'work', start: from, end: from + used, ms: used }); usedThisDay = true
        remaining -= used
        if (remaining === 0) return { result: from + used, events }
        dayCursor=interval.end
      }
      if (!usedThisDay && cursor <= baseDay) events.push({ type: 'skip', day: baseDay, reason: nonWorkingReasonAt(baseDay+43200000,adjustments,ignoreFixedDates) })
      cursor = nextDay.getTime()
    } else {
      let dayCursor=Math.min(cursor,nextDay.getTime())
      for (const interval of [...intervals].reverse()) {
        const to = Math.min(cursor, interval.end)
        if (to <= interval.start) continue
        if(to<dayCursor) events.push({type:'skip',day:baseDay,start:to,end:dayCursor,reason:nonWorkingReasonAt(to+(dayCursor-to)/2,adjustments,ignoreFixedDates)})
        const available = to - interval.start
        const used = Math.min(remaining, available)
        events.push({ type: 'work', start: to - used, end: to, ms: used }); usedThisDay = true
        remaining -= used
        if (remaining === 0) return { result: to - used, events }
        dayCursor=interval.start
      }
      if (!usedThisDay) events.push({ type: 'skip', day: baseDay, reason: nonWorkingReasonAt(baseDay+43200000,adjustments,ignoreFixedDates) })
      cursor = baseDay
    }
  }
  return null
}
