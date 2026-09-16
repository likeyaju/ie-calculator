/** Locale-neutral decimal input: comma and dot are alternative decimal separators. */
export function isValidDecimalDraft(value: string, signed = false) {
  return new RegExp(signed ? '^-?\\d*(?:[.,]\\d*)?$' : '^\\d*(?:[.,]\\d*)?$').test(value)
}

export function parseDecimalDraft(value: string) {
  if (value === '' || value === '-' || value === '.' || value === ',' || value === '-.' || value === '-,') return null
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

export function acceptDecimalDraft(raw: string, previous: string, signed = false) {
  return isValidDecimalDraft(raw, signed) ? raw : previous
}
