export const DXM = {
  freebaseFactor: 1.29812,
  defaultForm: 'robotabs',
  defaultIcon: require('../assets/icons/medbottle.png'),

  weight: {
    kg: 1,
    lbs: 0.453592,
  },

  plateaus: [
    {
      name: '1st',
      color: '#6610f2',
      factors: [1.5, 2.5]
    },
    {
      name: '2nd',
      color: '#8540f5',
      factors: [2.5, 7.5]
    },
    {
      name: '3rd',
      color: '#a370f7',
      factors: [7.5, 15]
    },
    {
      name: '4th',
      color: '#c29ffa',
      light: true,
      factors: [15, 20]
    }
  ],

  // Amounts are mg DXM HBr per unit
  forms: {
    robotabs: {
      name: 'RoboTablets (30 mg freebase)',
      icon: require('../assets/icons/tablet.png'),
      unit: 'tablets',
      factor: 38.94,
    },
    robocough: {
      name: 'RoboCough (mL)',
      unit: 'mL',
      factor: 10
    },
    gelcaps: {
      name: 'Robitussin Gelcaps (15 mg caps)',
      icon: require('../assets/icons/gelcap.png'),
      unit: 'caps',
      factor: 15,
    },
    pure: {
      name: 'Pure DXM HBr (mg)',
      icon: require('../assets/icons/powder.png'),
      unit: 'mg',
      factor: 1,
    },
    pureFreebase: {
      name: 'Pure DXM Freebase (mg)',
      icon: require('../assets/icons/powder.png'),
      unit: 'mg',
      factor: 1,
    },
    gelcaps30: {
      name: '30 mg Gelcaps (30 mg caps)',
      icon: require('../assets/icons/gelcap.png'),
      unit: 'caps',
      factor: 30,
    },
    robitussinDX: {
      name: 'Robitussin DX (mL)',
      unit: 'mL',
      factor: 3,
    },
    robitussinDXoz: {
      name: 'Robitussin DX (oz)',
      unit: 'oz',
      factor: 88.5
    },
  }
}