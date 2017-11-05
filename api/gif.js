var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId;
var gifCollection = 'gifs';
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var _database;

class Gif {
  img(request, response, path) {
    var imagePath = req.url;
    var url = 'http://127.0.0.1:8080/gifs/' + imagePath;

    request(url).pipe(res);
  }
  upload(request, response) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/../gifs');

    // every time a file has been uploaded successfully,
    // rename it to it's original name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, "test.jpg"));
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      response.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(request);
  }
  // LOGIN
  login(request, response) {
    let payload = {};
    // find user with email
    _database.collection(gifCollection).findOne({ 'email': request.body.email }).then((data) => {

    });
  }
  setDatabase(database) {
    _database = database;
  }
}

const gif = new Gif();
module.exports = gif;