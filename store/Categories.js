import { deepMerge } from '../util/Util'
import base from '../data/tripsit.categories.json'
import {_categories as custom, categoryPriority, categoryOrder} from '../data/Categories'


const Categories = deepMerge(base, custom)


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

// Colors must be in #rrggbb format only.

export let categories = Object.fromEntries(Object.entries(Categories).map(
  ([key, cat]) => {
    let priority = categoryPriority.indexOf(key)
    if (priority < 0) priority = Number.MAX_SAFE_INTEGER

    let order = categoryOrder.indexOf(key)
    if (order < 0) order = Number.MAX_SAFE_INTEGER

    return [key, {...cat, priority, order}]
  }
))