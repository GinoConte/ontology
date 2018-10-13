
var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var cors = require('cors')
var app = express();

app.use(cors())

//csv saving until a database gets set up
var json2csv = require('json2csv').parse;
var fs = require('fs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(3001, function () {
    console.log("Node API Running on port: ", server.address().port);
});

app.post("/new-node", function (req, res) {
  const nodes = req.body.nodes;
  let csvString = '';
  nodes.forEach(node => {
    csvString = csvString + `${node.id},${node.name},,,,,,,,,,,,,\r\n`;
  });
    
  // res.status(200).send('Success');

  if (csvString) {
    fs.appendFile('./utils/example2.csv', csvString, function (err) {
      if (err) throw err;
      res.status(200).send('Exported data to Knowledge Base!');
    });
  } else {
    res.status(200).send('Empty Data - No changes!');
  }

});
