import fs from 'fs'
import fetch from 'node-fetch'

const tripbot = new URL('https://tripbot.tripsit.me')
const getAllDrugs = new URL('/api/tripsit/getAllDrugs', tripbot)
const getAllCategories = new URL('/api/tripsit/getAllCategories', tripbot)

// Their certificate expired <_<
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

let sortObject = obj => Object.fromEntries(Object.entries(obj).sort())

function writeJSON(filename, obj, space = '\t') {
    fs.writeFileSync(filename, JSON.stringify(obj, null, '\t'))
}

async function getJSON(url) {
    console.log(`Fetching...`)
    let res = await fetch(url)

    console.log(`Parsing...`)
    return await res.json()
}

async function download(url, filename, func) {
    console.group(new URL(url).pathname)

    let obj = await getJSON(url)

    if (func) {
        console.log(`Processing...`)
        obj = func(obj)
    }

    console.log(`Writing to '${filename}'...`)
    writeJSON(filename, obj)

    console.groupEnd()
}

function fixTypo(obj, badKey, goodKey, badKeyIsBetter = false) {
    if (!(badKey in obj)) {
        return console.warn(`WARNING: fixTypo: Can't find bad key '${badKey}' in object`)
    }
    if ((goodKey in obj) && !badKeyIsBetter)
        console.warn(`WARNING fixTypo: Replacing correctly spelled key '${goodKey}' with value from bad key '${badKey}'`)
    obj[goodKey] = obj[badKey]
    delete obj[badKey]
}

function nuke(obj, badKey, goodKey = null) {
    if (goodKey !== null && !(goodKey in obj)) {
        console.warn(`WARNING nuke: Nuking key '${badKey}' with specified good key '${goodKey}' which doesn't exist in object.`)
    }
    if (!(badKey in obj)) console.warn(`WARNING nuke: Told to nuke key '${badKey}' but it doesn't exist in object`)
    delete obj[badKey]
}

function removeFromArray(array, value) {
    let i = array.indexOf(value)
    if (i < 0) {
        console.log('WARNING removeFromArray: Cannot find item "' + value + '" in array to remove.')
        return []
    }
    return array.splice(i)
}

await download(getAllDrugs, 'data/tripsit.drugs.json', obj => {
    const bioavailability = 'bioavailability'

    obj = obj.data[0]

    // non-keys
    fixTypo(obj['4-aco-mipt'].properties, '1-6', 'value')
    nuke(obj.bentazepam.properties, '2-6')
    nuke(obj['4-fa'].properties, '4-fa')

    nuke(obj['25b-nbome'].properties, 'a', 'summary')
    nuke(obj['hot-7'].properties, 'a', 'summary')
    nuke(obj.clomethiazole.properties, 'an', 'summary')
    nuke(obj.ghb.properties, 'summary=a', 'summary')
    nuke(obj.clobazam.properties, 'Summary', 'summary')
    fixTypo(obj.indapyrophenidone.properties, 'smmary', 'summary', true)
    
    nuke(obj.aet.properties, 'after-efects', 'after-effects')
    fixTypo(obj.truffles.properties, 'after-effect', 'after-effects')

    nuke(obj.butyrfentanyl.properties, 'alias', 'aliases')
    nuke(obj.triazolam.properties, 'alias', 'aliases')

    fixTypo(obj.noctec.properties, 'avod', 'avoid')
    fixTypo(obj.ethylmorphine.properties, 'Avoid', 'avoid')

    fixTypo(obj.amobarbital.properties, 'bioavaiability', bioavailability)
    fixTypo(obj.aniracetam.properties, 'bioavaiability', bioavailability)
    fixTypo(obj.apap.properties, 'bioavailabity', bioavailability)
    fixTypo(obj.bromantane.properties, 'bioavailabity', bioavailability)
    fixTypo(obj.brotizolam.properties, 'bioavailabity', bioavailability)
    nuke(obj.midazolam.properties, 'bioavailability:', bioavailability)
    nuke(obj.ketobemidone.properties, 'Bioavailability', bioavailability)

    nuke(obj.phenetrazine.properties, 'category', 'categories')
    nuke(obj.ephedrine.properties, 'category', 'categories')

    fixTypo(obj.bupropion.properties, 'contradictions', 'contraindictions')

    nuke(obj.hydromorphone.properties, 'dose:', 'dose')
    nuke(obj.det.properties, 'dosage', 'dose')
    nuke(obj['4-aco-dalt'].properties, 'dosage', 'dose')

    fixTypo(obj['bk-2c-i'].properties, 'Duration', 'duration')
    fixTypo(obj['4-aco-mipt'].formatted_duration, 'Duration', 'value')

    fixTypo(obj.bupropion.properties, 'general-effects', 'effects')

    fixTypo(obj.mxe.properties, 'legality', 'legal')

    obj.buprenorphine.properties.dose = obj.buprenorphine.properties.dose.replace(/[\u0003\u0002]\d{0,2}/g, '')
    delete obj.buprenorphine.formatted_dose // it's currently empty

    fixTypo(obj['bk-2c-i'].properties, 'Onset', 'onset')
    nuke(obj.mdphp.properties, 'onset:', 'onset')
    nuke(obj.clonazepam.properties, 'onset:', 'onset')

    fixTypo(obj['bk-2c-i'].properties, 'warn', 'warning')

    delete obj['2-fma'].formatted_dose['person-to-person']
    obj['2-fma'].dose_note += ' person-to-person and with usage factors. Higher doses can often result in long crashes and sleepless nights. Always start low and titrate slowly.'

    delete obj['yerba-mate'].formatted_dose.This

    removeFromArray(obj.yopo.properties.aliases, '"anadenanthera')
    removeFromArray(obj.yopo.aliases, '"anadenanthera')
    
    // Manual capitalization fixes
    obj['3-oh-phenazepam'].pretty_name = '3-OH-Phenazepam'
    obj.mdphp.pretty_name = 'MDPHP'
    
    let titleCase = (string, separators = [' ', '-']) => separators.reduce(
        // for each separator
        (str, sep) => str.flatMap(
            // split the string, capitalize each word, join the string
            s => s.split(sep).map(word => word[0].toUpperCase() + word.slice(1)).join(sep)
        ), [string]).join('')

    let capsNames = [
        '4-chlorodiazepam',
        'benzodioxole-fentanyl',
        'cyclopentyl-fentanyl',
        'ethyl-pentedrone',
        'l-theanine',
        'methoxyacetyl-fentanyl',
        'tetrahydrofuran-fentanyl',
        
    ]

    for (let key of capsNames) {
        obj[key].pretty_name = titleCase(obj[key].name)
        console.log('Fixing Capitalization: ' + obj[key].pretty_name)
    }
    
    return sortObject(obj)
})
await download(getAllCategories, 'data/tripsit.categories.json', obj => {

    obj = obj.data[0]
    delete obj.supplements // typo of 'supplement'

    return sortObject(obj)

})

