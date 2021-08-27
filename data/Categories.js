import merge from 'lodash.merge'
import Categories from './tripsit.categories.json'

/** Order of importance of information of categories.
 * 
 * Categories highest on this list will be shown first
 * on a substance's info page and can affect how the
 * substance is shown. Prioritizes most relevant
 * information about a substance.
 */
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

/** The order in which categories are listed in menus.
 * 
 * Order is similar to PsychonautWiki's substance index,
 * with prominence given to categories with "utility as
 * mind-expanding tools" over riskier or more addictive 
 * substances. It is also somewhat arbitrary.
 */
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

/** Get a substance objects's main category, based on categoryPriority order */
export function getMainCategory(substance) {
  let cats = substance?.categories ?? substance?.properties?.categories

  if (!cats)
    return null
  
  return cats
    .map(c => categories[c] ?? {})
    .reduce((a, b) => 
      (a.priority < b.priority) ? a : b
    )
}

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