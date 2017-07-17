const fs = require("fs");
const moment = require("moment");
const DATA_PATH = '../../data';
const DATA_PATH_CLIENT = '../../data/client';
const PUBLISHED_PATH = "../../data/published";
const DATE = process.argv[2];

let content = JSON.parse(fs.readFileSync(`${DATA_PATH}/weekly/prices-${DATE}.json`));
let wow = JSON.parse(fs.readFileSync(`${DATA_PATH}/weekly/wow.json`));

let feed = {};
let basket = [];

feed.id = moment().toDate().getTime();
feed.items = basket;
var totalBasketColes = 0;
var totalBasketWoolies = 0;
content.items.map( el => {
    let item = {};
    item.name = el.name;
    item.volumeSize = el.volumeSize;
    el.supplierProducts.map( prod => {
        if(prod.supplierCode === "COLES"){
            item.colesPrice = prod.price;
            totalBasketColes += item.colesPrice;
            totalBasketColes = parseFloat((Math.round(totalBasketColes * 100) / 100).toFixed(2));
        }
        else if(prod.supplierCode === "WOOLIES") {
            item.wooliesPrice = prod.price;
            totalBasketWoolies += item.wooliesPrice;
            totalBasketWoolies = parseFloat((Math.round(totalBasketWoolies * 100) / 100).toFixed(2));
        }
    });
    basket.push(item);
});
console.log("totalBasketColes:", totalBasketColes);
console.log("totalBasketWoolies:", totalBasketWoolies);

// Work out change amounts from last time
let colesPreviousTotal = wow[wow.length-1].total[0].coles;
let wooliesPreviousTotal = wow[wow.length-1].total[1].woolies;
console.log('colesPreviousTotal:', colesPreviousTotal);
console.log('wooliesPreviousTotal:', wooliesPreviousTotal);

// Now create a new 'wow' entry and append it
let wowObj = {};
wowObj.weekNum = wow.length + 1;
wowObj.date = DATE;
wowObj.total = [
    {"coles": parseFloat((Math.round(totalBasketColes * 100) / 100).toFixed(2))},
    {"woolies": parseFloat((Math.round(totalBasketWoolies * 100) / 100).toFixed(2))}
];
let colesChgAmount = totalBasketColes - colesPreviousTotal;
let colesChangePercent = parseFloat(((totalBasketColes - colesPreviousTotal) / colesPreviousTotal) * 100);
let wooliesChgAmount = totalBasketWoolies - wooliesPreviousTotal;
let wooliesChangePercent = parseFloat(((totalBasketWoolies - wooliesPreviousTotal) / wooliesPreviousTotal) * 100);

wowObj.changeFromPreviousWeek = [
    {
        "chain": "COLES",
        "changeUNIT": "AUD",
        "changeAmount": parseFloat(colesChgAmount.toFixed(2),10),
        "changePercent": parseFloat(colesChangePercent.toFixed(2),10)
    },
    {
        "chain": "WOOLIES",
        "changeUNIT": "AUD",
        "changeAmount": parseFloat(wooliesChgAmount.toFixed(2),10),
        "changePercent": parseFloat(wooliesChangePercent.toFixed(2),10)
    }
];

// Now push the object onto the wow object & UPDATE the wow.json file
wow.push(wowObj);
// Backup old file first
fs.renameSync(`${DATA_PATH}/weekly/wow.json`, `${DATA_PATH}/weekly/wow.json.${DATE}.bk`)
// Now write new file
fs.writeFileSync(`${DATA_PATH}/weekly/wow.json`, JSON.stringify(wow));

// Now we have the week on week total
feed.weekOnWeek = wow;

// Write to file for publishing
fs.writeFileSync(`${PUBLISHED_PATH}/pricesfeed-${DATE}.json`, JSON.stringify(feed));
