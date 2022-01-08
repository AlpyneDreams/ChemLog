
import { deepMerge } from '../util/Util'
import { getMainCategory, categories } from './Categories'
import base from './tripsit.drugs.json'

const DEFAULT_ICON = 'pill'

const icons = {
  lsd: require('../assets/icons/lsd.png')
}

export let Substances = deepMerge(base, {

  cannabis: {
    icon: 'cannabis',
    categories: ['cannabinoid']
  },
  marinol: {
    icon: 'pill',
    categories: ['cannabinoid']
  },

  lsd: {icon: icons.lsd},
  '1b-lsd': {icon: icons.lsd},
  '1cp-lsd': {icon: icons.lsd},
  '1p-lsd': {icon: icons.lsd},
  'ald-52': {icon: icons.lsd},

  mushrooms: {
    icon: 'mushroom-outline'
  },
  kratom: {
    icon: 'leaf',
    color: categories.cannabinoid.color,
  },
  mdma: {
    icon: categories.empathogen.icon,
    color: categories.empathogen.color
  },
  alcohol: {
    icon: 'glass-cocktail'
  },
  caffeine: {
    icon: 'coffee',
    //color: '#a34f27'
  },
  nicotine: {
    icon: require('../assets/icons/cigarette.png')
  }

})

for (let s of Object.values(Substances)) {
  if (!s.icon) {
    s.icon = (getMainCategory(s) ?? {}).icon ?? DEFAULT_ICON
  }
  if (!s.color) {
    s.color = (getMainCategory(s) ?? {}).color
  }
  if (s.properties?.categories && s.categories && s.categories.length !== s.properties.categories.length) {
    s.properties.categories = deepMerge(s.categories, s.properties.categories)
  }
}

export default Substances