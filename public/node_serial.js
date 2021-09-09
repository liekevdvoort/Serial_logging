// import dependencies
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

// loop over max com options
const max = 5;
for (let i = 1; i <= max; i++) {
    getActiveComPort(i)
        .then(function(port) {
            // set ledstrip to white
            port.write(`X002B[290005]\r\n`);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getActiveComPort(index) {
    // create a promise to resolve or reject the function call
    return new Promise(function(resolve, reject) {
        // create a port with the index to test
        const port = new SerialPort(`COM${index}`, { baudRate: 115200, autoOpen: false });

        // if the port is opened resolve promise
        port.on('open', function() {
            resolve(port);
        });

        // Try opening the port if error reject
        port.open(function (error) {
            if (error) {
                reject(error);
            }
        });
    });
}
