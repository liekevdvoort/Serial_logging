// import dependencies
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

//init const
const port = 3000;
var hue = 999;
var sat = 999;
var light = 999;

//init app
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

//run server
app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});

//router template
app.get("/", function (request, response) {
    response.render(path.join(__dirname, "/", "index.html"), {
        hue: hue,
        sat: sat,
        light: light,
    });
});

function tryComPort(index) {
    return new Promise((resolve, reject) => {
        const port = new SerialPort(`COM${index}`, {
            baudRate: 115200,
            autoOpen: false,
        });

        // Try opening the port if error reject
        port.open((error) => {
            if (error) {
                return reject({ index, port, error });
            }
        });

        port.on("open", () => {
            return resolve({ index, port });
        });
    });
}

async function tryComPorts(max = 5) {
    for (let index = 1; index <= max; index++) {
        try {
            return await tryComPort(index);
        } catch (err) {
            //console.error(err);
        }
    }
    throw new Error("Failed all attempts at COM port opening");
}

tryComPorts()
    .then(({ index, port }) => {
        const parser = port.pipe(new Readline({ delimiter: "\r\n" }));
        console.log(`geopende comport ${index}`);
        // console.log("comport", port);

        // intitialize ledstrip with white
        port.write(`X002B[290000]\r\n`);

        getDataFromColorSensor(parser, port);
        onSendButtonClick(port);
    })
    .catch((error) => {
        console.error(error);
    });

function getDataFromColorSensor(parser, port) {
    // get data from the color sensor
    parser.on("data", function (data) {
        console.log(data, "data");
        var msg = data.toString();
        var cleanmsg = msg.substring(
            msg.lastIndexOf("[") + 1,
            msg.lastIndexOf("]")
        );

        if (cleanmsg.includes("XX")) {
            console.log("Not a clean message");
        } else {
            console.log(cleanmsg + "____________________");
            cleanmsg = cleanmsg.substring(3).split(",");
            hue_1 = parseInt(cleanmsg[0]);
            sat_1 = parseInt(cleanmsg[1]);
            light_1 = parseInt(cleanmsg[2]);
            if (hue_1 > 0 && sat_1 > 0 && light_1 > 0) {
                hue = hue_1;
                sat = sat_1;
                light = light_1;
            }
        }
    });
}

function onSendButtonClick(port) {
    // when send button is clicked
    app.post("/", function (request, response) {
        response.sendFile(path.join(__dirname, "/", "success.html"));
        rgb_data = request.body.rgboutput;
        hex_data = request.body.hexoutput;
        hex_data_without_hashtag = hex_data.slice(1);

        setTimeout(() => {
            port.write(`X002B[12${hex_data_without_hashtag}]\r\n`);
        }, 300);
        setTimeout(() => {
            port.write(`X002B[299200]\r\n`);
        }, 600);

        hue = 999;
        sat = 999;
        light = 999;
    });
}
