const express = require('express');
const app = express();
const router = express.Router();

const serverless = require('serverless-http');

app.use(express.static(__dirname));
app.use(express.static('./node_modules/phaser/dist'));

router.get('/', (req, res) => {
    res.sendFile('/index.html')
});



module.exports = app;
module.exports.handler = serverless(app)