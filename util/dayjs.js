import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import en from 'dayjs/locale/en'

dayjs.extend(relativeTime, {
  // strict thresholds, no rounding
  thresholds: [
    { l: 's', r: 59, d: 'second' },
    { l: 'm', r: 1 },
  //{ l: 'mm', r: 59, d: 'minute' },
    { l: 'mm', r: 119, d: 'minute' }, // count minutes when under 2 hours
    { l: 'h', r: 1 },
  //{ l: 'hh', r: 23, d: 'hour' },
    { l: 'hh', r: 47, d: 'hour' },    // count hours when under 2 days
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y' },
    { l: 'yy', d: 'year' }
  ]  
})

dayjs.extend(calendar)

export const LOCALE_COMPACT = 'en-compact'
dayjs.locale(LOCALE_COMPACT, {
  ...en,
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s:  '0m',
    m:  '1m',
    mm: '%dm',
    h:  '1h',
    hh: '%dh',
    d:  '1d',
    dd: '%dd',
    M:  '1 month',
    MM: '%d months',
    y:  '1y',
    yy: '%dy'

  }
})

dayjs.locale('en')

export const CALENDAR_DATE_ONLY = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'MMMM D, YYYY'
}

export const CALENDAR_DATE_ONLY_MEDIUM = {
  ...CALENDAR_DATE_ONLY,
  nextWeek: 'MMMM D, YYYY',
  lastWeek: 'MMMM D, YYYY'
}

export const CALENDAR_DATE_ONLY_COMPACT = {
  ...CALENDAR_DATE_ONLY,
  nextWeek: 'MM/DD/YY',
  lastWeek: 'MM/DD/YY',
  sameElse: 'MM/DD/YY'
}

export default dayjs