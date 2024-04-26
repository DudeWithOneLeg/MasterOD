const cr = require('./google-languages.json')
const fs = require('fs')
const obj = {}

for (let coun of cr) {
    obj[coun.language_name] = coun.language_code
}

fs.writeFileSync('google-countries-1.json', JSON.stringify(obj, null, 2))
