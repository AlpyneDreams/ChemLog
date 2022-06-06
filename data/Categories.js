
export const _categories = {
  cannabinoid: {
    name: "cannabinoid",
    description: "",
    wiki: "",
    tips: [],
    icon: require('../assets/icons/cannabis.png'),
    color: '#32a852'
  },
  stimulant: {
    color: '#0aa2c0',
    chipIcon: 'arrow-up-bold'
  },
  depressant: {
    color: '#dc3545',
    chipIcon: 'arrow-down-bold'
  },
  dissociative: {
    color: '#6610f2',
    icon: 'head-snowflake'
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
    icon: require('../assets/icons/opioid.png')
  },
  benzodiazepine: {
    color: '#59359a',
    icon: require('../assets/icons/tablet.png')
  },
  deliriant: {
    color: '#984c0c',
  },
  nootropic: {
    color: '#2eab63',
    icon: 'head-cog'
  },
  hormonal: {
    name: "hormonal",
    icon: 'gender-transgender',
  },
  estrogen: {
    name: "estrogen",
    icon: 'gender-transgender',
    color: '#F7A8B8',     // From trans flag
    chipColor: '#e0607a', // Darker variant
    unlisted: true
  },
  progestogen: {
    name: "progestogen",
    icon: 'gender-transgender',
    color: '#F7A8B8',
    chipColor: '#e0607a',
    unlisted: true
  },
  serm: {
    name: "serm",
    pretty_name: "SERM",
    icon: 'gender-transgender',
    unlisted: true
  },
  antiandrogen: {
    name: "antiandrogen",
    icon: 'gender-transgender',
    color: '#F7A8B8',
    chipColor: '#e0607a',
    unlisted: true
  },
  androgen: {
    name: "androgen",
    icon: 'gender-transgender',
    color: "#55CDFC",       // From trans flag
    chipColor: '#35acdb',   // Darker variant
    unlisted: true
  }
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

/**
 * Similar to categoryOrder, but 2-dimensional,
 * used in the substance search menu.
 */
export const categoryRows = [
  ['common', 'psychedelic', 'empathogen', 'deliriant'],
  ['cannabinoid', 'stimulant', 'depressant', 'hormonal'],
  ['dissociative', 'opioid', 'benzodiazepine', 'nootropic'],
]