var https = require('https');
var express = require('express');
var querystring = require('querystring');

var app = express();

var clientId = '1326358006';
var clientSecret = '827c8cfce0877fb37cc24b076945840f';

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

app.get('/response', function(req, res){
  console.log('REQUEST IN: ' + req.query.code);
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
    'redirect_uri': 'abc'
  });

  var options = {
    hostname: 'api.weibo.com',
    port: 443,
    path: '/oauth2/access_token?'+postData,
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Content-Length': postData.length
    // }
  };

  console.log('TARGET PATH', options.path);

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
  req.write('');
  req.end();
}

var port = 8082;
app.listen(port);
console.log('server is running on '+port);