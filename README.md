# Open Data Feed - Sydney Shopping Basket
The objective of this project is to highlight the importance of Open Data. This is important today as the Government publish free consumable data across many departments and actively encourage developers to find new innovatives uses for this data that ultimately enhances the life of the communities in which we live.

This example tracks the prices increases/decreases of Woolies & Coles from week to week. It takes a typical shopping basket - not items that are necessarily bought every week, but typical items that are generally bought by shoppers in Sydney - and totals the weekly price for both supermarkets - tracking the percentage and absolute changes from week to week. It should provide fodder for some interesting front-end sites.

Note that sometimes the items in the basket will change due to searches for current items not working. This is currently manual so one must go though the data to find out if the items are exactly the same as last week. This again could be a feature of a front-end build. At some point, the data feed may contain shopping basket week to week changes - if any - so that the developer will not have to work it out from an 'id' comparison for example. Note that in order to do this comparison, the developer would have to store files, week to week to compare them.

## Shopping basket items
The actual items in the shopping basket can be found here:
https://www.choice.com.au/shopping/everyday-shopping/supermarkets/articles/how-we-surveyed-the-supermarkets

## Price Generation Process

### Setup Environment
Open the ./env file and set the correct DATE property. Typically this will be a Wednesday and will look something like
this:

DATE=2017-07-05

### Generate new data files
To generate a new set of data files call the client.js with appropriate parameters:

    node client.js 0 33

This will run 33 requests to www.frugl.com.au for the shopping basket items and the responses will be saved to ./data/client and named `prices-raw-XX.json`. Each response contains a generalized search response. Somewhere in the response is the required item - thus the response needs to be parsed to extract this item which is effectively the next step.

A backup of the previous files will also be placed in ./data/backups and named `clientdata-YYYY-MM-DDHH:MM:SS`

** TODO: Zip the folder up!

Options
-k will 'keep' existing data files. For example you may want to generate say 2 files for testing, then another 2 files but keep the first 2 files. If you do not use this option, the files under ./data/client will all be deleted before making the new requests for the raw data responses.

### Merge the correct prices into a single price file
In order to generate a single price file containing just the prices of the items that we want we must run the following:

node generate-prices.js YYYY-MM-DD

** TODO: At the current time of writing, you need to pass the date in. This will be surpassed by the usage of the .env file and is a small change.

A file with the following naming convention will be created in the ./data/weekly directory:

`prices-YYYY-MM-DD.json`

### Create the data feed
The final step in the data creation is to create the data feed. This can be done with the following command:

node generate-feed-data.js YYYY-MM-DD

This will backup the wow.json file to a file with the naming convention `wow.json.YYYY-MM-DD.bk` and will then create a new one - wow.json. This file contains the week on week aggregated position of prices/totals.

It will also create a new published file in the 'published' directory with the current date appended ie. the naming convention is:

`pricesfeed-YYYY-MM-DD.json`

An example of the data feed is shown below:

    {
        "id": 1500299223993,
        "items": [{
            "name": "Sunblest White Bread",
            "volumeSize": "650g",
            "colesPrice": 2.8,
            "wooliesPrice": 2.8
        }, {
            "name": "Dairy Milk Chocolate Large Block",
            "volumeSize": "350g",
            "colesPrice": 5,
            "wooliesPrice": 5
        }, {
            "name": "Full Cream Milk",
            "volumeSize": "2L",
            "wooliesPrice": 4.69,
            "colesPrice": 4.7
        }, {
            "name": "Traditional Spreadable Butter Blend",
            "volumeSize": "500g",
            "colesPrice": 5.8,
            "wooliesPrice": 5.8
        }, {
            "name": "Tasty Cheese Block",
            "volumeSize": "500g",
            "colesPrice": 9.19,
            "wooliesPrice": 8.6
        }, {
            "name": "Classic French Vanilla Ice Cream",
            "volumeSize": "1L",
            "colesPrice": 9.9,
            "wooliesPrice": 9
        }, {
            "name": "Frozen Baby Peas",
            "volumeSize": "1kg",
            "wooliesPrice": 4.69,
            "colesPrice": 5.17
        }, {
            "name": "Caramel Crowns Chocolate Biscuits",
            "volumeSize": "200g",
            "colesPrice": 4.02,
            "wooliesPrice": 3.65
        }, {
            "name": "Beer Battered Frozen Shoestring Fries",
            "volumeSize": "750g",
            "colesPrice": 4.5,
            "wooliesPrice": 3.99
        }, {
            "name": "Coke",
            "volumeSize": "1L",
            "colesPrice": 4.17,
            "wooliesPrice": 3.89
        }, {
            "name": "Strawberry Jam in Glass",
            "volumeSize": "500g",
            "colesPrice": 3.69,
            "wooliesPrice": 2.5
        }, {
            "name": "Breakfast Plus Cereal",
            "volumeSize": "410g",
            "colesPrice": 4.95,
            "wooliesPrice": 4.49
        }, {
            "name": "Orange Juice Chill",
            "volumeSize": "3L",
            "colesPrice": 7.35,
            "wooliesPrice": 7.5
        }, {
            "name": "Cling Wrap 30m x 33cm",
            "volumeSize": "30m",
            "colesPrice": 2.7,
            "wooliesPrice": 2.7
        }, {
            "name": "Scottish Sardines in Springwater",
            "volumeSize": "110g",
            "colesPrice": 2.85,
            "wooliesPrice": 2.67
        }, {
            "name": "Olive Oil Extra Light El Delicado",
            "volumeSize": "4L",
            "colesPrice": 25,
            "wooliesPrice": 29
        }, {
            "name": "Cherry Tomatoes Prepacked",
            "volumeSize": "250g",
            "colesPrice": 3,
            "wooliesPrice": 3
        }, {
            "name": "Gluten Free Penne Pasta",
            "volumeSize": "250g",
            "colesPrice": 4.38,
            "wooliesPrice": 3.99
        }, {
            "name": "Plain Flour",
            "volumeSize": "1kg",
            "colesPrice": 3.3,
            "wooliesPrice": 3.99
        }, {
            "name": "White Sugar",
            "volumeSize": "1kg",
            "colesPrice": 2.21,
            "wooliesPrice": 2
        }, {
            "name": "3ply Large 'N' Thick Facial Tissues",
            "volumeSize": "95 pack",
            "colesPrice": 2.86,
            "wooliesPrice": 2.6
        }, {
            "name": "Rose and Cherry Touch of Foam Hand Wash",
            "volumeSize": "250ml",
            "wooliesPrice": 3,
            "colesPrice": 3.85
        }, {
            "name": "Sensitive Front & Top Loader Laundry Liquid",
            "volumeSize": "2L",
            "colesPrice": 22,
            "wooliesPrice": 19.99
        }, {
            "name": "Super Strength Lemon Dishwashing Liquid",
            "volumeSize": "900ml",
            "colesPrice": 7.65,
            "wooliesPrice": 6.95
        }, {
            "name": "Free Range X Large Eggs 12 pack",
            "volumeSize": "700g",
            "colesPrice": 6.35,
            "wooliesPrice": 6.5
        }, {
            "name": "BBQ Chicken Kebabs",
            "volumeSize": "80g x 10 pack",
            "colesPrice": 13.6,
            "wooliesPrice": 13.5
        }, {
            "name": "Frozen Fish Fingers",
            "volumeSize": "25g x 15 pack",
            "colesPrice": 6.16,
            "wooliesPrice": 5.6
        }, {
            "name": "Granny Smith Apples",
            "volumeSize": "",
            "colesPrice": 0.54
        }, {
            "name": "Bananas",
            "volumeSize": "",
            "colesPrice": 0.79,
            "wooliesPrice": 0.86
        }, {
            "name": "Broccoli",
            "volumeSize": "",
            "colesPrice": 1.87,
            "wooliesPrice": 1.65
        }, {
            "name": "Carrots Prepacked",
            "volumeSize": "1kg",
            "colesPrice": 1.2,
            "wooliesPrice": 1.5
        }, {
            "name": "Washed Potatoes Prepacked",
            "volumeSize": "2kg",
            "colesPrice": 7,
            "wooliesPrice": 7
        }],
        "weekOnWeek": [{
            "weekNum": 1,
            "date": "2017-06-28",
            "total": [{
                "coles": 149.95
            }, {
                "woolies": 138.12
            }],
            "changeFromPreviousWeek": [{
                "chain": "COLES",
                "changeUNIT": "AUD",
                "changeAmount": 0,
                "changePercent": 0
            }, {
                "chain": "WOOLIES",
                "changeUNIT": "AUD",
                "changeAmount": 0,
                "changePercent": 0
            }]
        }, {
            "weekNum": 2,
            "date": "2017-07-05",
            "total": [{
                "coles": 152.32
            }, {
                "woolies": 141.21
            }],
            "changeFromPreviousWeek": [{
                "chain": "COLES",
                "changeUNIT": "AUD",
                "changeAmount": 2.37,
                "changePercent": 1.58
            }, {
                "chain": "WOOLIES",
                "changeUNIT": "AUD",
                "changeAmount": 3.09,
                "changePercent": 2.24
            }]
        }, {
            "weekNum": 3,
            "date": "2017-07-12",
            "total": [{
                "coles": 199.55
            }, {
                "woolies": 195.17
            }],
            "changeFromPreviousWeek": [{
                "chain": "COLES",
                "changeUNIT": "AUD",
                "changeAmount": 47.23,
                "changePercent": 31.01
            }, {
                "chain": "WOOLIES",
                "changeUNIT": "AUD",
                "changeAmount": 53.96,
                "changePercent": 38.21
            }]
        }]
    }


### Orchestrating the whole process
It is possible to complete all of the steps in one go by called the following node file thus:

    node main.js 0 33 [-k]

This streamlines the production process and will enable further improvements to be made such as data verification through unit tests.

### Copy the new file to the raspberry pi
The easiest way to do this is to commit the files to the repo first.

Pull the new stuff on the Pi with Git:

    git pull

Start VNC Server on the Pi:

    vncserver :1

Open a VNC connection to the raspberry pi from your machine.

Stop the current running node process:

    ps -aef | grep 'node'
    kill -9 PID

Start the node server process from the /home/pi/bitbucket/groceryp directory

    node ./server/server.js

You should now be publishing the new data.

## Improvements
    - Add Unit Testing with a Javascript framework
    - Utilise a Cron job to kick everything off at the appropriate time
    - Add monitoring code
    - Add a CI build
