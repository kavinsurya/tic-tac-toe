const express = require("express");
const app = express();
const http  = require('http').Server(app);

const port = 5050;

app.get('/', function (req, res) {
  console.log('kavin');
});


http.listen(port, () => console.log(`listening on port ${port}`));