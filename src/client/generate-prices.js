const fs = require("fs");
const moment = require("moment");
const DATA_PATH = '../../data';
const DATA_PATH_CLIENT = '../../data/client';
const DATE = process.argv[2];
const DATE_TEST = "TEST";

let priceModel = { items: [] };
let basketItems = [
    { name: "sunblest-white-bread", colesId: 243, wooliesId: 24523},
    { name: "chocolate-milk-block", colesId: 3731, wooliesId: 31424 },
    { name: "full-cream-milk", colesId: 1388, wooliesId: 25563 },
    { name: "butter", colesId: 2073, wooliesId: 26285 },
    { name: "cheese", colesId: 1799, wooliesId: 26302 },
    { name: "vanilla-ice-cream", colesId: 8499, wooliesId: 35032 },
    { name: "peas-frozen", colesId: 8758, wooliesId: 34316 },
    { name: "biscuits-chocolate", colesId: 2974, wooliesId: 31960 },
    { name: "shoestring-fries", colesId: 8062, wooliesId: 34750 },
    { name: "cola", colesId: 8929, wooliesId: 33805 },
    { name: "strawberry-jam", colesId: 5629, wooliesId: 30226 },
    { name: "cereal", colesId: 2567, wooliesId: 30508 },
    { name: "coffee-instant", colesId: 7961, wooliesId: 33021 },
    { name: "juice-orange", colesId: 9367, wooliesId: 33470 },
    { name: "cling-wrap", colesId: 12566, wooliesId: 39930 },
    { name: "sardines", colesId: 7254, wooliesId: 28000 },
    { name: "oil-olive", colesId: 6447, wooliesId: 26884 },
    { name: "tomatoes", colesId: 520, wooliesId: 44638 },
    { name: "pasta-penne", colesId: 6571, wooliesId: 29044 },
    { name: "flour-plain", colesId: 4796, wooliesId: 30941 },
    { name: "sugar-white", colesId: 4879, wooliesId: 30885 },
    { name: "tissues", colesId: 15421, wooliesId: 40031 },
    { name: "handwash-antibacterial", colesId: 15617, wooliesId: 35426 },
    { name: "detergent", colesId: 12957, wooliesId: 40189 },
    { name: "dishwashing-liquid", colesId: 12911, wooliesId: 40407 },
    { name: "eggs-free-range", colesId: 1533, wooliesId: 25539 },
    { name: "bbq-chicken", colesId: 17986, wooliesId: 24982 },
    { name: "fish-fingers", colesId: 8272, wooliesId: 34414 },
    { name: "apples-granny-smith", colesId: 417, wooliesId: 24085 },
    { name: "bananas", colesId: 437, wooliesId: 24105 },
    { name: "broccoli", colesId: 617, wooliesId: 24198 },
    { name: "carrots", colesId: 546, wooliesId: 24222 },
    { name: "potatoes-washed", colesId: 532, wooliesId: 24294 },
]

// Find each basket item in prices-raw
basketItems.map((item,i) => {
    // Load the correct file
    let itemPricesResponse = JSON.parse(fs.readFileSync(`${DATA_PATH_CLIENT}/prices-raw-${i}.json`));

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
fs.writeFileSync(`${DATA_PATH}/weekly/prices-${DATE}.json`, JSON.stringify(priceModel));
