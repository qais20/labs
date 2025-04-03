const request = require('request');

setInterval(() => {
    // Use 127.0.0.1 instead of localhost
    const base = "http://127.0.0.1:8080";

    const list = ["rocksolid", "normal", "needhelp", "mirror", "delay", "abort", "canary"];

    list.forEach(i => {
        const url = base + "/" + i;
        console.log("> calling " + url);
        request(url, (err, response, body) => {
            if (err) {
                console.log(err);
            } else {
                console.log("< response " + response.statusCode);
            }
        });
    });
}, 1500);
