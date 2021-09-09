// import dependencies
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const max = 5;
for (let i = 1; i <= max; i++) {
    getActiveComPort(i)
        .then(function(port) {
            port.write('Hi port is open');
        })
        .catch(function(error) {
            console.log(error);
        });
}

// defining the serialPort
function getActiveComPort(index) {
    return new Promise(function(resolve, reject) {
        const port = new SerialPort(`COM${index}`, { baudRate: 115200, autoOpen: false });

        port.on('open', function() {
            resolve(port);
        });

        port.open(function (error) {
            if (error) {
                reject(error);
            }
        });
    });
}


// definedPort.on("open", function(){
//     console.log("open");
//     port.write('test naar com 4 \n\r')
// })




// let transmitter = new SerialPort(`COM3`, {
//     baudRate: 115200,
// });

    
// the serial port parser
// const parser = new Readline();
// transmitter.pipe(parser);

// read the data from the serial port
///parser.on('data', (line) => console.log(line, 'parser.on data'));

// log something if port is open
