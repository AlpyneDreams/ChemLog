
import { deepMerge } from '../util/Util'
import { getMainCategory } from './Categories'
import base from '../data/tripsit.drugs.json'
import {_substances as custom, DEFAULT_ICON} from '../data/Substances'

export let Substances = deepMerge(base, custom)

for (let [key, s] of Object.entries(Substances)) {
  if (!s.name) {
    s.name = key
  }
  if (key in custom && !(key in base)) {
    s.custom = true;
  }
  if (s.icon === undefined) {
    s.icon = (getMainCategory(s) ?? {}).icon ?? DEFAULT_ICON
  }
  if (s.color === undefined) {
    s.color = (getMainCategory(s) ?? {}).color
  }
  if (s.properties?.categories && s.categories) {
    let cats = s.categories

    // Merge categories
    if (s.categories.length !== s.properties.categories.length) {
      cats = s.categories.concat(s.properties.categories)
    }

    // Remove dupliacte categories
    s.properties.categories = Array.from(new Set(cats))
    s.categories = s.properties.categories
  }
}

export default Substances