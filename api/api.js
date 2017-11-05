var express = require('express');
var router = express.Router();
var gif = require('./gif');

router.get('/test', (request, response) => {
  response.json("HELLO WORLD!");
  // provider.login(request, response);
});

router.get('/img', (request, response) => {
  gif.img(request, response);
})

router.post('/upload', (request, response, path) => {
  gif.upload(request, response, path);
});

module.exports = router;