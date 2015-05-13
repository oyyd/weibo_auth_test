var https = require('https');
var express = require('express');
var querystring = require('querystring');

var app = express();

var clientId = '0c0c4982bc466d712424dc8834d34853';
var clientSecret = '0acb43d73e6abbce';

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

app.get('/response', function(req, res){
  makeRequest(req.query.code, function(data){
    console.log('REQUEST END');
    res.send('The token of <strong>'+req.ip+'</strong> is: ' + req.query.code
        + '<br/> After request we get this:<br/>' + data);
  });
});

app.get('/token_detail', function(req, res){
  console.log('Get token_detail');
  console.log(req.body);
});

function makeRequest(token, cb){
  var data = '';
  var postData = querystring.stringify({
    'client_id' : clientId,
    'client_secret' : clientSecret,
    'grant_type': 'authorization_code',
    'code': token,
    'redirect_uri': 'http://testauth.oyyd.net/response'
  });
  //https://www.douban.com/service/auth2/token
  var options = {
    hostname: 'www.douban.com',
    port: 443,
    path: '/service/auth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });    
  });

  console.log('REQ', req);

  req.on('close', function(){
    cb(data);
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

var port = 8082;
app.listen(port);
console.log('server is running on '+port);