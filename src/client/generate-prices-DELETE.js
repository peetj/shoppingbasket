const fs = require("fs");
const moment = require("moment");
const debug = require('debug')('shoppingbasket');
const pad = require('pad');

const DATA_PATH = './data';
const DATA_PATH_CLIENT = './data/client';

let priceModel = { items: [] };
let basketItems = [
  { "name": "Rustic White Bread","colesId": 251,"wooliesId": 24500 },
  { "name": "Granny Smith Apples","colesId": 417,"wooliesId": 24085 },
  { "name": "Bananas","colesId": 437,"wooliesId": 24105 },
  { "name": "Greenhouse Truss Tomatoes","colesId": 523,"wooliesId": 24186 },
  { "name": "Juicing Carrot","colesId": 550,"wooliesId": 24223 },
  { "name": "Broccoli","colesId": 617,"wooliesId": 24198 },
  { "name": "Full Cream Milk","colesId": 1426,"wooliesId": 25562 },
  { "name": "Free Range X Large Eggs 12 pack","colesId": 1529,"wooliesId": 25536 },
  { "name": "Natural Tasty Cheese Slices 15 pack","colesId": 1782,"wooliesId": 26352 },
  { "name": "Traditional Spreadable Butter Blend","colesId": 2102,"wooliesId": 26284 },
  { "name": "Breakfast Plus Cereal","colesId": 2567,"wooliesId": 30508 },
  { "name": "Tim Tams Original Chocolate","colesId": 2954,"wooliesId": 32012 },
  { "name": "Family Block Chocolate Hazelnut","colesId": 3747,"wooliesId": 31453 },
  { "name": "Plain Flour","colesId": 4795,"wooliesId": 30964 },
  { "name": "White Sugar","colesId": 4879,"wooliesId": 30885 },
  { "name": "Strawberry Jam","colesId": 5642,"wooliesId": 30220 },
  { "name": "Olive Oil Pure El Tradicional","colesId": 6425,"wooliesId": 26889 },
  { "name": "Penne Rigati Pasta No 18","colesId": 6483,"wooliesId": 29045 },
  { "name": "Scottish Sardines in Springwater","colesId": 7254,"wooliesId": 28000 },
  { "name": "Blend 43 Instant Coffee Granules","colesId": 7680,"wooliesId": 33077 },
  { "name": "Golden Crunch Frozen Potato Chips","colesId": 8056,"wooliesId": 34741 },
  { "name": "Frozen Fish Fingers 15 pack","colesId": 8272,"wooliesId": 34414 },
  { "name": "Classic French Vanilla Ice Cream","colesId": 8499,"wooliesId": 35032 },
  { "name": "Frozen Peas","colesId": 8754,"wooliesId": 34317 },
  { "name": "Coke","colesId": 8815,"wooliesId": 33806 },
  { "name": "100% Orange Juice Box","colesId": 9240,"wooliesId": 33594 },
  { "name": "Super Strength Lemon Dishwashing Liquid","colesId": 12911,"wooliesId": 40407 },
  { "name": "Sensitive Front & Top Loader Laundry Liquid","colesId": 12957,"wooliesId": 40189 },
  { "name": "3ply Large 'N' Thick Facial Tissues","colesId": 15421,"wooliesId": 40031 },
  { "name": "Milk & Honey Liquid Softwash Pump","colesId": 15634,"wooliesId": 35457 }
]

// Find each basket item in prices-raw
basketItems.map((item,i) => {
    // Load the correct file
    let itemPricesResponse = JSON.parse(fs.readFileSync(`${DATA_PATH_CLIENT}/prices-raw-list-${moment().format('YYYY-M-D')}.json`));

    // Now we need to find the basket item based on the IDs
    let colesIDToFind = item.colesId;
    let wooliesIDToFind = item.wooliesId;

    // Search the items from the original response
    itemPricesResponse.items.map((resItem, j) => {
        let supplierProducts = resItem.supplierProducts;
        // Test the first supplier product
        if(supplierProducts[0].supplierProductId === colesIDToFind || supplierProducts[0].supplierProductId === wooliesIDToFind){
            priceModel.items.push(resItem);
        }
    });
});

// Write out model to new file
let file = `${DATA_PATH}/weekly/prices-${moment().format('YYYY-M-D')}.json`;
fs.writeFileSync(file, JSON.stringify(priceModel));
debug(`Written: ${file}`);
