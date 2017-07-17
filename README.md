## Shopping basket items
The actual items in the shopping basket can be found here:
https://www.choice.com.au/shopping/everyday-shopping/supermarkets/articles/how-we-surveyed-the-supermarkets

## Price Generation Process

### Create folders
Create a new folder for the date in the groceryp->data folders
Create a 'raw' and 'weekly' folder inside the 'data' folder

### Copy raw files from previous week
Copy the files
Remove the content of all the raw data files

cat /dev/null > ./data/{DATE}/raw/prices-raw-XX.json

### Make GET requests for shopping basket items
There are a couple of items that will need fixing because a couple of items do not have Coles and Woolies equivalents
26 and 27 need to have the Woolies items consolidated into the Coles entries

### Run the generate-prices.js script
First copy the previous weekly model so that we have one
TODO - Create a model with 0.00 for all prices

Run the following:
node generate-prices.js {DATE}

You will end up with an updated file with new prices.

### Create the data feed
node generate-feed-data.js {DATE}

This will backup the wow.json file and create a new one - wow.json
It will also create a new published file in the 'published' directory with the current date appended.

### Final tasks
Change the entry in published/latest.json to the current date

### Copy the new file to the raspberry pi
The easiest way to do this is to commit the files to the repo first. This is groceryp on BitBucket.
git pull the new stuff on the Pi
Start VNC Server on the Pi
    vncserver :1

Open a VNC connection to the raspberry pi from your machine
Stop the current running node process:
    ps -aef | grep 'node'
    kill -9 PID

Start the node server process from the /home/pi/bitbucket/groceryp directory

node ./server/server.js

You should now be publishing the new data.



## Improvements
    - Write a script to create the data directories
    - The script should also create the raw files
