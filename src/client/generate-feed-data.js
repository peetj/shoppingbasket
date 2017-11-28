/**
 * WOW format
 [
     {
         "weekNum": 1,
         "date": "2017-06-28",
         "total": [
             {
                 "coles": 149.95
             },
             {
                 "woolies": 138.12
             }
         ],
         "changeFromPreviousWeek": [
             {
                 "chain": "COLES",
                 "changeUNIT": "AUD",
                 "changeAmount": 0,
                 "changePercent": 0
             },
             {
                 "chain": "WOOLIES",
                 "changeUNIT": "AUD",
                 "changeAmount": 0,
                 "changePercent": 0
             }
         ]
     }
 ]
 */

const fs = require("fs");
const moment = require("moment");
const debug = require('debug')('shoppingbasket');
const pad = require('pad');

const DATA_PATH = './data';
const DATA_PATH_CLIENT = './data/client';
const PUBLISHED_PATH = "./data/published";

let content = JSON.parse(fs.readFileSync(`${DATA_PATH}/client/prices-raw-list-${moment().format('YYYY-M-D')}.json`));
let wow = JSON.parse(fs.readFileSync(`${DATA_PATH}/weekly/wow.json`));
let feed = {};
let basket = [];

feed.id = moment().toDate().getTime();
feed.items = basket;
let totalBasketColes = 0;
let totalBasketWoolies = 0;
let totalDiscountColes = 0;
let totalDiscountWoolies = 0;

content.items.map( (item_old, idx) => {
    let item_new = {}
    item_new.id = item_old.id
    item_new.sequenceNumber = idx
    item_new.name = item_old.name
    item_new.volumeSize = item_old.volumeSize
    item_old.supplierProducts.map( prod => {
        if(prod.supplierCode === "COLES"){
            item_new.colesPrice = prod.price
            item_new.discount = prod.discount
            totalBasketColes += item_new.colesPrice;
            totalBasketColes = parseFloat((Math.round(totalBasketColes * 100) / 100).toFixed(2));
            totalDiscountColes += prod.discount;
        }
        else if(prod.supplierCode === "WOOLIES") {
            item_new.wooliesPrice = prod.price;
            item_new.discount = prod.discount
            totalBasketWoolies += item_new.wooliesPrice;
            totalBasketWoolies = parseFloat((Math.round(totalBasketWoolies * 100) / 100).toFixed(2));
            totalDiscountWoolies += prod.discount;
        }
    });
    basket.push(item_new);
});

debug(`totalBasketColes: ${totalBasketColes}`);
debug(`totalBasketWoolies: ${totalBasketWoolies}`);
debug(`totalDiscountColes: ${totalDiscountColes}`);
debug(`totalDiscountWoolies: ${totalDiscountWoolies}`);

// Work out change amounts from last time
if(wow.length === 0) debug( 'Setting totals for the FIRST time !');
let colesPreviousTotal = wow.length > 0 ? wow[wow.length-1].total[0].coles : 0;
let wooliesPreviousTotal = wow.length > 0 ? wow[wow.length-1].total[1].woolies: 0;
debug(`colesPreviousTotal: ${colesPreviousTotal}`);
debug(`wooliesPreviousTotal: ${wooliesPreviousTotal}`);

// Now create a new 'wow' entry and append it
let wowObj = {};
wowObj.weekNum = wow.length + 1;
wowObj.calendarWeekNum = moment(new Date(), "MMDDYYYY").week();
wowObj.date = moment().format('YYYY-M-D');
wowObj.total = [
    {"coles": parseFloat((Math.round(totalBasketColes * 100) / 100).toFixed(2))},
    {"woolies": parseFloat((Math.round(totalBasketWoolies * 100) / 100).toFixed(2))},
    {"colesDiscountTotal": parseFloat((Math.round(totalDiscountColes * 100) / 100).toFixed(2))},
    {"wooliesDiscountTotal": parseFloat((Math.round(totalDiscountWoolies * 100) / 100).toFixed(2))}
];
let colesChgAmount = totalBasketColes - colesPreviousTotal;
let colesChangePercent = parseFloat(((totalBasketColes - colesPreviousTotal) / colesPreviousTotal) * 100);
let wooliesChgAmount = totalBasketWoolies - wooliesPreviousTotal;
let wooliesChangePercent = parseFloat(((totalBasketWoolies - wooliesPreviousTotal) / wooliesPreviousTotal) * 100);
debug(`colesChgAmount=${colesChgAmount}\ncolesChangePercent=${colesChangePercent}\nwooliesChgAmount=${wooliesChgAmount}\nwooliesChangePercent=${wooliesChangePercent}`)

wowObj.changeFromPreviousWeek = [
    {
        "chain": "COLES",
        "changeUNIT": "AUD",
        "changeAmount": !isNaN(parseFloat(colesChgAmount.toFixed(2),10)) ? 0 : parseFloat(colesChgAmount.toFixed(2),10),
        "changePercent": !isNaN(parseFloat(colesChangePercent.toFixed(2),10)) ? 0 : parseFloat(colesChangePercent.toFixed(2),10)
    },
    {
        "chain": "WOOLIES",
        "changeUNIT": "AUD",
        "changeAmount": !isNaN(parseFloat(wooliesChgAmount.toFixed(2),10)) ? 0 : parseFloat(wooliesChgAmount.toFixed(2),10),
        "changePercent": !isNaN(parseFloat(wooliesChangePercent.toFixed(2),10)) ? 0 : parseFloat(wooliesChangePercent.toFixed(2),10)
    }
];

// Validation check to ensure we only update the correct week entry
let isWowUpdated = false;
let updatedWow = wow.map((el, idx) => {
    if(el.calendarWeekNum === wowObj.calendarWeekNum){
        // Replace values in this object
        isWowUpdated = true;
        wowObj.weekNum = el.weekNum;
        return wowObj;
    }
    else{
        return el;
    }
});

debug(updatedWow)
debug(wowObj)
debug(`isWowUpdated = ${isWowUpdated}`)

// Now push the object onto the wow object & UPDATE the wow.json file
// Append wowObj if isWowUpdated is TRUE OR this is the first time ie. wow.length == 0
if(!isWowUpdated || wow.length === 0){
    debug('Updating WOW object!')
    updatedWow.push(wowObj);
}

// Backup old file first
let wowFile = `${DATA_PATH}/weekly/wow.json`;
let backupFile = `${DATA_PATH}/weekly/wow.json.${moment().format('YYYY-M-D')}.bk`;
fs.renameSync(wowFile, backupFile)
debug(`Backed up to ${backupFile}`)

// Now write new file
fs.writeFileSync(wowFile, JSON.stringify(updatedWow));
debug(`Written ${wowFile}`)

// Now we have the week on week total
feed.weekOnWeek = updatedWow;

// Write to file for publishing
let publishedFile = `${PUBLISHED_PATH}/pricesfeed-${moment().format('YYYY-M-D')}.json`;
fs.writeFileSync(publishedFile, JSON.stringify(feed));
debug(`Written: ${publishedFile}`);
debug('END');
