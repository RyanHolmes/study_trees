var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }))

// app.set('view engine', 'ejs');

app.use(express.static('public'));

app.post('/data', function(req, res){
  res.sendStatus(200);

  fs.writeFile(__dirname + '/public/javascripts/data.js', "function getData() {\n" + "var data =" + req.body.value + ";\n" + "return data;}", function (err) {
    if (err) {
      console.log(err);
    }
  });
  fs.writeFile(__dirname + '/data.txt', req.body.value, function (err) {
    if (err) {
      console.log(err);
    }
  });

});

app.listen(3000, function(){
  console.log("running on port localhost:3000");
});

app.get('/data', function(req, res){
  var data = fs.readFileSync(__dirname + '/data.txt');
  res.send(data);
  res.sendStatus(200);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/pages/landing.html');
});

app.get('/iterate', function(req, res){
  res.sendFile(__dirname + '/public/pages/iterate.html');
});

app.get('/tree', function(req, res){
  res.sendFile(__dirname + '/public/pages/tree.html');
});

app.get('/dashboard', function(req, res){
  res.sendFile(__dirname + '/public/pages/dashboard.html');
});
