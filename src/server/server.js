
let fs = require("fs");
let RTM = require('satori-sdk-js');
let schedule = require('node-schedule');

let endpoint = "wss://open-data.api.satori.com";
let appkey = "Ee4E4CBfbCBB855f1D6aF50A53Dc6CD4";
let role = "sydney-shopping-basket-comparison";
let roleSecretKey = "131b1f0bd9Ac3aC3BBbb8CB73DA2b230";
let channel = "sydney-shopping-basket-comparison";

let file = JSON.parse(fs.readFileSync("./published/latest.json"));
let msg = JSON.parse(fs.readFileSync(`./published/${file.name}`));

var roleSecretProvider = RTM.roleSecretAuthProvider(role, roleSecretKey);

var rtm = new RTM(endpoint, appkey, {
  authProvider: roleSecretProvider,
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);

var j = schedule.scheduleJob('2 * * * * *', function(){
    console.log('Publishing message:', msg);
    publishData( msg );
});

rtm.start();

function publishData (message) {
    rtm.publish(channel, message, function (pdu) {
      console.log("Publish ack:", pdu);
    });
}
