const fs = require('fs-extra')
const jsonfile = require('jsonfile');
const rmdir = require("rmdir");
const moment = require("moment");
const request = require("request");
const jsonFormat = require("json-format");
const debug = require('debug')('shoppingbasket');
const pad = require('pad');

const APP_NAME = 'Shopping Basket';
const DATA_PATH_CLIENT = './data/client';
const FILE_TYPE_LIST = 0;
const FILE_TYPE_BASKET = 1;

const URL = 'https://api.frugl.com.au/api/v2/mylist/get/';
const LIST_ID = 18655;

let _options = {
    method: 'GET',
    url: URL+LIST_ID,
    headers: {
        'postman-token': 'e9c2c72f-abfb-3904-c44b-2de3cd6c391e',
        'cache-control': 'no-cache'
    }
}

/**
 * Execute a single xhr request. If no errors then write out the
 * body to a file.
 * @return n/a
 */
function searchForList(){
    request(_options, function(error, response, body) {
        if (error) throw new Error(error);

        // Write out Report on items
        if(debug.enabled){
            printFeedReport(JSON.parse(body));
        }

        // Generate basketItems for next process and write it
        generateBasket(JSON.parse(body));

        // Write out model to new file
        writeToFile(FILE_TYPE_LIST, body);
    });
}

function generateBasket(pricelist) {
    let items = pricelist.items;
    let basket = [];

    items.forEach((el, idx) => {
        let item = {};
        item.name = el.name;
        el.supplierProducts.forEach((sp) => {
            sp.supplierCode === "COLES" ? item.colesId = sp.supplierProductId : item.wooliesId = sp.supplierProductId;
        })
        basket.push(item);
    })

    // Write the basket object to a file
    writeToFile(FILE_TYPE_BASKET, basket);
}

/**
 * Writes some JSON to a file
 * @param  {Number} fileType Type of file to write as different files may require different treatment
 * @param  {Object} content  Body of response
 * @return n/a
 */
function writeToFile(fileType, content) {
    let file
    if(fileType === FILE_TYPE_LIST){
        file = `${DATA_PATH_CLIENT}/prices-raw-list-${moment().format('YYYY-M-D')}.json`
        jsonfile.writeFileSync(file, JSON.parse(content), {spaces: 2})
        debug(`Written: ${file}` )
    }
    else if(fileType === FILE_TYPE_BASKET){
        file = `${DATA_PATH_CLIENT}/prices-raw-list-basket-${moment().format('YYYY-M-D')}.json`
        jsonfile.writeFileSync(file, content, {spaces: 2})
        debug(`Written: ${file}` )
    }
}

function printFeedReport(pricelist) {
    let colesTotalPrice = 0;
    let colesTotalDiscount = 0;
    let wooliesTotalPrice= 0;
    let wooliesTotalDiscount = 0;
    debug('******************************************************************************');
    debug('NUM ITEMS: %d', pricelist.items.length);
    debug('');
    debug('ITEM NAMES');
    pricelist.items.forEach((el, idx) => {
        // Add prices
        el.supplierProducts.forEach((sp) => {
            sp.supplierCode === "COLES" ? colesTotalPrice += sp.price : wooliesTotalPrice += sp.price;
            sp.supplierCode === "COLES" ? colesTotalDiscount += sp.discount : wooliesTotalDiscount += sp.discount;
        })
        debug(`${pad(el.name, 50)}, #PROD:${el.supplierProducts.length}` );
    });
    debug('******************************************************************************');
    debug(`COLES TOTAL PRICE: ${colesTotalPrice.toFixed(2)}`);
    debug(`WOOLIES TOTAL PRICE: ${wooliesTotalPrice.toFixed(2)}`);
    debug(`COLES TOTAL DISCOUNT: ${colesTotalDiscount.toFixed(2)}`);
    debug(`WOOLIES TOTAL DISCOUNT: ${wooliesTotalDiscount.toFixed(2)}`);
    debug('******************************************************************************');
}

// Kick it off
debug('Fetching prices for %s', APP_NAME)
searchForList();
