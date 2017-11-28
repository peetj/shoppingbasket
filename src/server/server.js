
/**
 * Publish to Satori.com
 *
 * To run:
 *  DEBUG=shoppingbasket npm run publish
 *
 * OR:
 *  npm run publish
 */

let fs = require("fs");
let RTM = require('satori-sdk-js');
let schedule = require('node-schedule');
let pretty = require('js-object-pretty-print').pretty;
const debug = require('debug')('shoppingbasket');

let endpoint = "wss://open-data.api.satori.com";
let appkey = "Ee4E4CBfbCBB855f1D6aF50A53Dc6CD4";
let role = "sydney-shopping-basket-comparison";
let roleSecretKey = "131b1f0bd9Ac3aC3BBbb8CB73DA2b230";
let channel = "sydney-shopping-basket-comparison";

let DATA_PATH = '/Users/peetj/github/shoppingbasket'

let file = JSON.parse(fs.readFileSync(`${DATA_PATH}/data/published/latest.json`));
let msg = JSON.parse(fs.readFileSync(`${DATA_PATH}/data/published/${file.name}`));

var roleSecretProvider = RTM.roleSecretAuthProvider(role, roleSecretKey);

var rtm = new RTM(endpoint, appkey, {
  authProvider: roleSecretProvider,
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);

// Executes the job when the second is 2 ie. 11.34 and 2 seconds
const TEST_SCHEDULE = '2 * * * * *'; // Every minute
const LIVE_SCHEDULE = '49 * * * *'; // Every hour at 42 minutes past
let timeSchedule = LIVE_SCHEDULE;
debug(`Using SCHEDULE: ${timeSchedule}`);

var j = schedule.scheduleJob(timeSchedule, function(){
    // Make the message unique - add a timestamp
    msg.ts = (new Date()).getTime();
    debug(`Publishing message: ${pretty(msg)}`);
    publishData( msg );
});

rtm.start();

function publishData (message) {
    rtm.publish(channel, message, function (pdu) {
        debug(`Publishing ack: ${pretty(pdu)}`);
    });
}
