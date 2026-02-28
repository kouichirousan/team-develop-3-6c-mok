import { format, startOfWeek } from 'date-fns'

export function isEarlyBird(time: Date): boolean {
  return time.getHours() < 8
}

export function calculatePoints(isEarlyBird: boolean, isFirstLunch: boolean = false): number {
  let points = 10 // Base check-in points
  if (isEarlyBird) points += 20
  if (isFirstLunch) points += 50
  return points
}

export function getWeekStart(date: Date = new Date()): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
