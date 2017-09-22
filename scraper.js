/* ******************** CONTINUOUS USE OF ONE CHROME INSTANCE ************************* */

// Puppeteer Docs: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
// Example of service use: http://localhost:8001/?url=https://www.google.com/

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 8001;

var browser = "";
var enp = "";

//Bad logging function - update
function log(message){
    let date = new Date();
    let month = (Number(date.getMonth())+1);
    if(month < 10){
        month = "0" + month;
    }
    let hours = Number(date.getHours());
    if(hours < 10){
        hours = "0" + hours;
    }
    let days = Number(date.getDate());
    if(days < 10){
        days = "0" + days;
    }
    let minutes = Number(date.getMinutes());
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    let seconds = Number(date.getSeconds());
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    let output = date.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
    console.log(output + ": " + message); //Y-M-D H:M:S
}

//Start Chrome headless
async function setup() {
    log("Initiating browser launch.");
    browser = await puppeteer.launch({
        args:['--no-sandbox']
    });
    log("Browser launched, opening page.");
    let page = await browser.newPage();
    log("Page opened, loading https://google.com");
    await page.goto('https://www.google.com');
    log("Google loaded, browser functioning. Finding browser endpoint.");
    enp = await browser.wsEndpoint();
    log("Browser endpoint found: " + enp.toString());
    log("Test complete, closing page.");
    await page.close();
    log("Browser ready! Setup finished, service launched.");
}

setup();

app.use(function (req, res, next) {
    log("Request received from: " + req.connection.remoteAddress);
    let initDate = new Date().getTime();

    puppeteer.connect({browserWSEndpoint:enp}).then(async() => {
        var url = req.query.url;
    if(url) {
        url = await req.query.url;
        url = await url.toString();
    } else {
        log("NOTICE: Missing URL parameter, disregarding request.");
        return;
    }
    let page = await browser.newPage();

    await page.goto(url, {timeout: 60000});
    const remover = page.waitForFunction('function test(){return document.getElementsByTagName("img").removeAttribute("src");}');
    await remover;
    let result = await page.evaluate(() => Promise.resolve(document.documentElement.outerHTML));

    let cLength = await Promise.resolve(Buffer.byteLength(result, 'utf-8'));
    res.set('Content-Type', 'text/plain');
    res.set('Content-Length', cLength);
    res.write(result);
    res.end();

    let endDate = new Date().getTime();
    let finalDate = endDate - initDate;
    log("Response (HTTP Code: " + res.statusCode + ") sent.");
    await page.close();
}).catch(function(e){
        log("ERROR: "+ e);
    });

});

app.listen(port);

