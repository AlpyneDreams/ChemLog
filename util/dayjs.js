import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'

dayjs.extend(relativeTime)
dayjs.extend(calendar)

export const CALENDAR_DATE_ONLY = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'MMMM D, YYYY'
}

export const CALENDAR_DATE_ONLY_COMPACT = {
  ...CALENDAR_DATE_ONLY,
  nextWeek: 'MM/DD/YY',
  lastWeek: 'MM/DD/YY',
  sameElse: 'MM/DD/YY'
}

export default dayjs