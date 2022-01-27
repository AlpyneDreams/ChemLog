import { categories } from '../store/Categories'

export const DEFAULT_ICON = 'pill' 

const icons = {
  lsd: require('../assets/icons/lsd.png')
}

export const _substances = {

/// SUBSTANCE OVERRIDES ///

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
  },

/// CUSTOM SUBSTANCES ///

  'l-tyrosine': {
    pretty_name: "L-Tyrosine",
    categories: ['supplement']
  },

/// HRT ///

  // Estrogens
  estradiol: {
    pretty_name: "Estradiol",
    aliases: ["Estrofem"],
    categories: ['hormonal', 'estrogen']
  },
  'estradiol-valerate': {
    pretty_name: "Estradiol valerate",
    aliases: ["Progynova"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },
  'estradiol-cypionate': {
    pretty_name: "Estradiol cypionate",
    aliases: ["Depo-Estradiol"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },
  'estradiol-enanthate': {
    pretty_name: "Estradiol enanthate",
    aliases: ["Perlutal", "Topasel"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },
  'estradiol-benzoate': {
    pretty_name: "Estradiol benzoate",
    aliases: ["Progynon-B"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },
  'conjugated-estrogens': {
    pretty_name: "Conjugated estrogens",
    aliases: ["Premarin", "CEEs"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },
  'polyestradiol-phosphate': {
    pretty_name: "Polyestradiol phosphate",
    aliases: ["Estradurin"],
    categories: ['hormonal', 'estrogen'],
    summary: "An estradiol ester."
  },

  // Progestogens 
  progesterone: {
    pretty_name: "Progesterone",
    categories: ['hormonal', 'progestogen']
  },
  'medroxyprogesterone-acetate': {
    pretty_name: "Medroxyprogesterone acetate",
    categories: ['hormonal', 'progestogen'],
    color: null // Sometimes used in masculinizing HRT to suppress menstruation
  },
  hydroxyprogesterone: {
    pretty_name: "Hydroxyprogesterone",
    categories: ['hormonal', 'progestogen']
  },
  levonorgestrel: {
    pretty_name: "Levonorgestrel",
    aliases: ["Plan B"],
    categories: ['hormonal', 'progestogen']
  },
  dydrogesterone: {
    pretty_name: "Dydrogesterone",
    aliases: ["Duphaston"],
    categories: ['hormonal', 'progestogen']
  },
  drospirenone: {
    pretty_name: "Drospirenone",
    aliases: ["Slynd", "Yasmin"],
    categories: ['hormonal', 'progestogen']
  },
  lynestrenol: {
    pretty_name: "Lynestrenol",
    aliases: ["Exluton", "Ministat"],
    categories: ['hormonal', 'progestogen'],
    color: null // Sometimes used in masculinizing HRT to suppress menstruation
  },

  // Antiandrogens
  spironolactone: {
    pretty_name: "Spironolactone",
    aliases: ["spiro"],
    categories: ['hormonal', 'antiandrogen']
  },
  bicalutamide: {
    pretty_name: "Bicalutamide",
    aliases: ["Casodex"],
    categories: ['hormonal', 'antiandrogen']
  },
  enzalutamide: {
    pretty_name: "Enzalutamide",
    aliases: ["Xtandi"],
    categories: ['hormonal', 'antiandrogen']
  },
  finasteride: {
    pretty_name: "Finasteride",
    aliases: ["propecia"],
    categories: ['hormonal', 'antiandrogen'],
    summary: "A 5α-reductase inhibitor",
    color: null // Sometimes used in masculinizing HRT to suppress hair loss
  },
  dutasteride: {
    pretty_name: "Dutasteride",
    aliases: ["avodart"],
    categories: ['hormonal', 'antiandrogen'],
    summary: "A 5α-reductase inhibitor",
    color: null // Sometimes used in masculinizing HRT to suppress hair loss
  },
  'cyproterone-acetate': {
    pretty_name: "Cyproterone acetate",
    categories: ['hormonal', 'antiandrogen', 'progestogen'],
    color: null
  },

  // SERMs
  raloxifene: {
    pretty_name: "Raloxifene",
    categories: ['hormonal', 'serm']
  },
  tamoxifen: {
    pretty_name: "Tamoxifen",
    categories: ['hormonal', 'serm']
  },
  clomifene: {
    pretty_name: "Clomifene",
    aliases: ["clomiphene"],
    categories: ['hormonal', 'serm']
  },

  // Others
  domperidone: {
    pretty_name: "Domperidone",
    categories: ['hormonal'],
    summary: "Domperidone is an antiemetic that can also be used to induce lactation",
    color: categories.estrogen.color // Used in feminizing HRT
  },

  'gnrh-modulators': {
    pretty_name: "GnRH modulators",
    aliases: [
      "Leuprorelin", "Buserelin", "Triptorelin", "Goserelin",
      "GnRH analogues", "GnRH agonists", "GnRH antagonists",
    ],
    categories: ['hormonal'],
  },

  // Androgens
  testosterone: {
    pretty_name: "Testosterone",
    categories: ['hormonal', 'androgen']
  },
  'testosterone-enanthate': {
    pretty_name: "Testosterone enanthate",
    aliases: ["Delatestryl"],
    categories: ['hormonal', 'androgen'],
    summary: "A testosterone ester."
  },
  'testosterone-propionate': {
    pretty_name: "Testosterone propionate",
    aliases: ["Testoviron"],
    categories: ['hormonal', 'androgen'],
    summary: "A testosterone ester."
  },
  'testosterone-cypionate': {
    pretty_name: "Testosterone cypionate",
    aliases: ["Depo-Test"],
    categories: ['hormonal', 'androgen'],
    summary: "A testosterone ester."
  },
  'testosterone-isobutyrate': {
    pretty_name: "Testosterone isobutyrate",
    aliases: ["Agovirin", "Depot"],
    categories: ['hormonal', 'androgen'],
    summary: "A testosterone ester."
  },
  'testosterone-undecanoate': {
    pretty_name: "Testosterone undecanoate",
    aliases: ["Andriol", "Jatenzo"],
    categories: ['hormonal', 'androgen'],
    summary: "A testosterone ester."
  },
  'testosterone-esters': {
    pretty_name: "Mixed testosterone esters",
    aliases: ["Sustanon"],
    categories: ['hormonal', 'androgen'],
    summary: "Mixed testosterone esters."
  }
}
