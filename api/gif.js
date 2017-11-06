var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId;
var gifCollection = 'gifs';
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var _database;

class Gif {
  // GET IMAGE
  img(request, response, path) {
    var imagePath = req.url;
    var url = 'http://127.0.0.1:8080/gifs/' + imagePath;
    request(url).pipe(res);
  }
  // GET ALL GIF INFORMATION
  getAll(request, response) {
    _database.collection(gifCollection).find({}).toArray(function(err, data) {
      response.json(data);
    });
  }
  // GET A MEME
  getMeme(request, response) {
    response.json('test');
  }
  // SEARCH
  search(request, response) {
    var regex = new RegExp(request.params.entry, 'i');
    var searchInput = [
      { 'name': { $regex: regex} },
      { 'tags': { $regex: regex} }
    ];
    _database.collection(gifCollection).find({ $or: searchInput }).toArray((error, data) => {
      response.json(data); 
    });
  }
  // SEARCH TAG
  searchTag(request, response) {
    _database.collection(gifCollection).find({ 'tags': request.params.tag }).toArray((error, data) => {
      response.json(data); 
    });
  }
  // UPLOAD IMAGE + CREATED DATABASE RECORD
  upload(request, response) {
    // create an incoming form object
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/../gifs');
    // every time a file has been uploaded successfully,
    // rename it to it's original name
    form.on('field', function(field, value) {
      var data = JSON.parse(value);
      _database.collection(gifCollection).insertOne({
        name: data.name,
        tags: data.tags,
        downloads: 0,
        views: 0,
        added: Date.now()
      });
      form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, data.name + '.jpg'));
      });
    });
    // log errors
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });
    // once file is uploaded, send a response to the client
    form.on('end', function() {
      response.end('success');
    });
    // parse the incoming request containing the form data
    form.parse(request);
  }
  setDatabase(database) {
    _database = database;
    // _database.collection(gifCollection).remove({});
  }
}

const gif = new Gif();
module.exports = gif;