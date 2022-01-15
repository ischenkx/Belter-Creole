const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google_creds.json'); // the file saved above

let OUTPUT_FILE = 'dict.json'
if (process.argv.length > 2) {
    OUTPUT_FILE = process.argv[2]
}

async function main() {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet('1AvezPa3wOsLzBVe_Srr1lOROGDhQ9V-iTPK0-jItSl4');

    // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo(); // loads document properties and worksheets
    
    let dict = {}

    for (let sheetIndex = 0; sheetIndex < doc.sheetCount; sheetIndex++) {
        let sheet = doc.sheetsByIndex[sheetIndex]

        try {
            let rows = await sheet.getRows()
            for (let row of rows) {
                let belter = row['Belter']
                let english = row['English']
                if (!english || !belter) continue
                dict[english] = belter
            }
        } catch (ex) {
            console.log('error:', ex)
        }
    }

    const fs = require('fs')

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dict))
}

main()