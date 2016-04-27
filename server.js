var express = require("express");
var app = express();

var path = require('path');
app.set("view options", {layout: false});

app.use(express.static(path.join(__dirname, '/')));
// app.use(express.static(__dirname + '/js'));
// app.use(express.static(__dirname + '/css'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
    // res.sendFile('./index.html');
});
// Server config
app.listen(3001);
console.log("started listening from here");