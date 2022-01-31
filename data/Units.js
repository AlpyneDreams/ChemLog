export default {
  mg:     {symbol: 'mg',  name: 'Milligrams', factor: 1000, default: true},
  g:      {symbol: 'g',   name: 'Grams',      factor: 1},

  // 'μ' U+03BC Greek Small Letter Mu
  μg:     {symbol: 'µg',  name: 'Micrograms', factor: 1000000},
  // 'µ' U+00B5 Micro Sign
  µg:     {symbol: 'µg',  name: 'Micrograms', factor: 1000000, hidden: true},
  ug:     {symbol: 'µg',  name: 'Micrograms', factor: 1000000, hidden: true},
  mcg:    {symbol: 'µg',  name: 'Micrograms', factor: 1000000, hidden: true},

  // Volume Units
  mL:     {symbol: 'mL', name: 'Milliliters', factor: 1000, type: 'volume'}

}