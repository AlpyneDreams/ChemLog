import merge from 'lodash.merge'
import Categories from './tripsit.categories.json'

const categoryPriority = [
  'deliriant',
  'dissociative',
  'psychedelic',
  'opioid',
  'empathogen',
  'benzodiazepine',
  'stimulant',
  'depressant',
]

const categoryOrder = [
  'psychedelic',
  'empathogen',
  'stimulant',
  'depressant',
  'dissociative',
  'opioid',
  'benzodiazepine',
  'deliriant',
]

export const categories = Object.fromEntries(Object.entries(
  merge(Categories, {

    stimulant: {
      color: '#0aa2c0',
    },
    depressant: {
      color: '#dc3545',
    },
    dissociative: {
      color: '#6610f2',
    },
    psychedelic: {
      color: '#d63384',
    },
    empathogen: {
      color: '#20c997',
    },
    opioid: {
      color: '#052c65',
    },
    benzodiazepine: {
      color: '#59359a',
    },
    deliriant: {
      color: '#984c0c',
    },
  })
).map(
  ([key, cat]) => {
    let priority = categoryPriority.indexOf(key)
    if (priority < 0) priority = Number.MAX_SAFE_INTEGER

    let order = categoryOrder.indexOf(key)
    if (order < 0) order = Number.MAX_SAFE_INTEGER


    return [key, {...cat, priority, order}]
  }
))