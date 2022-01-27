
export const _categories = {
  cannabinoid: {
    name: "cannabinoid",
    description: "",
    wiki: "",
    tips: [],
    icon: 'cannabis',
    color: '#32a852'
  },
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
    icon: require('../assets/icons/psychedelic.png')
  },
  empathogen: {
    color: '#20c997',
    icon: require('../assets/icons/empathogen.png')
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
}

/** Order of importance of information of categories.
 * 
 * Categories highest on this list will be shown first
 * on a substance's info page and can affect how the
 * substance is shown. Prioritizes most relevant
 * information about a substance.
 */
export const categoryPriority = [
  'deliriant',
  'dissociative',
  'cannabinoid',
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
export const categoryOrder = [
  'psychedelic',
  'empathogen',
  'cannabinoid',
  'stimulant',
  'depressant',
  'dissociative',
  'opioid',
  'benzodiazepine',
  'deliriant',
]

