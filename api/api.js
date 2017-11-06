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
  gif.getMeme(request, response);
});

router.get('/search/tag/:tag', (request, response) => {
  gif.searchTag(request,response);
});

router.get('/search/:entry', (request, response) => {
  gif.search(request, response);
});

router.put('/memes/downloaded/:id', (request, response) => {
  gif.downloaded(request, response);
});

router.put('/memes/viewed/:id', (request, response) => {
  gif.viewed(request, response);
});


router.get('/img', (request, response) => {
  gif.img(request, response);
})

module.exports = router;