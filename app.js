const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static('static'));

const CAPTION_READY_IN = 2 * 60 * 1000;

const captionReady = {};

const responseTemplate = {
    "files": [],
    "summary": {
        "current_page": 1,
        "per_page": 10,
        "total_entries": 9606,
        "total_pages": 961
    }
};

app.get('/files', function (req, res) {
    const queryQ = req.query.q;
    let response = {
        files: []
    };
    if (captionReady[queryQ]) {
        console.log(`-------- CAPTION STATUS ${queryQ} IS READY  --------`);
        try {
            response = require(`./apiFixture/files/${queryQ}`);
        } catch (error) {
            response = responseTemplate;            
        }
        res.send(response);
    } else {
        console.log(`-------- CAPTION STATUS ${queryQ} NOT READY --------`);
        setTimeout(() => {
            captionReady[queryQ] = true
        }, CAPTION_READY_IN);
        res.send(responseTemplate);
    }
    console.log();
});

app.post('/files', function (req, res) {
    const body = req.body;
    res.send({});
    console.log();
});


app.listen(4001, () => console.log('Example app listening on port 4001!'));