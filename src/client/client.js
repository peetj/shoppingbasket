const fs = require('fs-extra')
const jsonfile = require('jsonfile');
const rmdir = require("rmdir");
const moment = require("moment");
const request = require("request");
const jsonFormat = require("json-format");
const DATA_PATH_CLIENT = '../../data/client';
const DATA_PATH_BACKUP = '../../data/backups'
const DATA_FILE_CLIENT_BACKUP_NAME = 'clientdata-';
const DATA_FILE_CLIENT_BACKUP_EXT = '.tar.gz';
const URL = 'https://api.frugl.com.au/api/v2/search/products';
const START_ITEM = process.argv[2];
const END_ITEM = process.argv[3];
console.log("START_ITEM, END_ITEM", START_ITEM, END_ITEM)
const keepFiles = process.argv.includes('-k') ? true : false ;

let _ctr = 0;
let _searchTerms = [
    'sunblest white bread',
    'Cadbury Dairy Milk Chocolate Large Block',
    'full cream milk',
    'Butter',
    'Cheese',
    'Vanilla ice cream',
    'Frozen peas',
    'Chocolate biscuits',
    'Beer battered frozen shoestring fries',
    'Cola',
    'Strawberry Jam',
    'Cereal',
    'Instant coffee',
    'Orange juice',
    'Cling wrap',
    'Sardines',
    'Olive oil',
    'Tomatoes',
    'Penne pasta',
    'Plain flour',
    'White sugar',
    'Tissues',
    'Hand wash',
    'Detergent',
    'Dishwashing liquid',
    'Free range eggs',
    'BBQ chicken kebabs',
    'Fish fingers',
    'Granny Smith apples',
    'Bananas',
    'Broccoli',
    'Carrots',
    'Washed potatoes',
]

let _qs = {
        locationId: 411,
        pageNumber: 1,
        pageSize: 40,
    }

let _options = {
    method: 'GET',
    url: URL,
    headers: {
        'postman-token': 'a9d7e511-950e-fec4-c46a-b245d8e549a5',
        'cache-control': 'no-cache'
    }
}

// Check arguments are there otherwise EXIT !!!
if(process.argv.length < 4){
    console.log("Command format: node client.js {START_INDEX} {END_INDEX}");
    return;
}

function backupData(){
    fs.copy(DATA_PATH_CLIENT, `${DATA_PATH_BACKUP}/${DATA_FILE_CLIENT_BACKUP_NAME}${moment().format()}`, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Successfully backed up data!");
        cleanupDataDir();
      }
    }); //copies directory, even if it has subdirectories or files
}

function cleanupDataDir(){
    console.log('clean up data dir....!');
    // Clean up data directory if keepFiles was not specified in args!
    if(!keepFiles){
        let dir = DATA_PATH_CLIENT;
        if (fs.existsSync(dir)){
            rmdir(dir, function (err, dirs, files) {
              console.log(dirs);
              console.log(files);
              console.log('\nAll files are removed\n');

              // Re-create data directory
              if (!fs.existsSync(dir)){
                  fs.mkdirSync(dir);
              }

              // Start Requests!
              startRequests();
            });
        }
    }
    else{
        startRequests();
    }
}

function startRequests() {
    // Start Requests!
    console.log('\nStarting Requests...', START_ITEM, END_ITEM);
    searchForItem(START_ITEM, END_ITEM);
}

/**
 * Execute a single xhr request. If no errors then write out the
 * body to a file.
 * @param  {String} `item` the search term
 * @return n/a
 */
function searchForItem(start, end){
    _ctr = start;
    let item = _searchTerms[_ctr];
    _qs.searchTerms = item;
    _options.qs = _qs;

    request(_options, function(error, response, body) {
        if (error) throw new Error(error);

        if(_ctr < end){
            console.log('Request-', _ctr, ": ", item);
            // Write out model to new file
            let file = `${DATA_PATH_CLIENT}/prices-raw-${_ctr}.json`
            jsonfile.writeFileSync(file, JSON.parse(body), {spaces: 2})

            // Call the next item
            searchForItem(++_ctr, end);
        }
    });
}


// Kick it off
backupData();
