var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require('mongodb');
var routes = require('./api/api');
var path = require('path');
var app = express();
var url = 'mongodb://localhost:27017/reaction-gif';

var gifs = require('./api/gif');

app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/scripts')));
app.use('/img', express.static(path.join(__dirname, '/gifs')));

app.use(bodyParser.json());

app.get('/', function(request, response){
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/api', routes);

mongodb.MongoClient.connect(url, function(error, database) {
  gifs.setDatabase(database);
  app.listen(8080, function () {
    console.log("App now running!");
  });
});