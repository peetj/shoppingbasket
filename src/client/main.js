const env = require('node-env-file');
const childProcess = require('child_process');
const DATA_PATH_ENV = '.';

// Load environment file
env(`${DATA_PATH_ENV}/.env`);

function runScript(scriptPath, args, callback) {
    // Keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var proc = childProcess.fork(scriptPath, args);
    // Cleanse args
    if(args.length > 1){
        args[0] = parseInt(args[0], 10);
        args[1] = parseInt(args[1], 10);
    }

    // Listen for errors as they may prevent the exit event from firing
    proc.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // Execute the callback once the process has finished running
    proc.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

// Now we can run a script and invoke a callback when complete, e.g.
console.log('BEGIN...\n');
runScript('./src/client/client.js', process.argv.slice(2), function (err) {
    if (err) throw err;
    console.log('Finished running client.js');

    runScript('./src/client/generate-feed-data.js', [process.env.DATE], function (err) {
        if (err) throw err;
        console.log('\nFinished running generate-feed-data.js');
        console.log('END');
    });
});
