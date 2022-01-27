import { categories } from '../store/Categories'

export const DEFAULT_ICON = 'pill' 

const icons = {
  lsd: require('../assets/icons/lsd.png')
}

export const _substances = {
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
}
