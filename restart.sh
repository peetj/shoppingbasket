#!/bin/bash

PID=$(ps a | grep "[s]erver.js" | awk '{print $1}')
echo $PID

if [ -z "$PID" ]
then
   echo "server.js is NOT running!"

   # Restart server.js
   echo "Restarting server.js..."
   node /Users/peetj/github/shoppingbasket/src/server/server.js
else
   echo "\$PID is NOT empty"

   # Kill the process
   echo "Killing process with pid="$PID
   echo "Restarting server.js..."
   kill -9 $PID

   # Restart the process
   node /Users/peetj/github/shoppingbasket/src/server/server.js
fi

# 10 second delay
sleep 10

# Now print out the pid of the running process as it should be running
NEW_PID=$(ps a | grep "[s]erver.js" | awk '{print $1}')
echo "server.js running on:" $NEW_PID

#END
