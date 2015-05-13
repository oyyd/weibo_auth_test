var express = require('express');

var app = express();

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

app.get('/response', function(req, res){
  res.send('success');
  console.log(req.query.code);
});

var port = 8082;
app.listen(port);
console.log('server is running on '+port);