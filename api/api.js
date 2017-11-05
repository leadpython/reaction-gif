var express = require('express');
var router = express.Router();
var gif = require('./gif');

router.post('/upload', (request, response, path) => {
  gif.upload(request, response, path);
});

router.get('/memes', (request, response) => {
  gif.getAll(request,response);
});

router.get('/memes/:id', (request, response) => {
  gifs.getMeme(request, response);
});

router.get('/search/:entry', (request, response) => {
  gifs.search(request, response);
});


router.get('/img', (request, response) => {
  gif.img(request, response);
})

module.exports = router;