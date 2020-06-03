var express = require('express');
var app = express();
var config = require('./fileConfig');
var session = require('express-session');
var hour = 3600000;

var port = 3000;
var message = 'listening on port 3000';
var webPath = '';

if (!config.debug) {
	port = process.env.PORT;
	message = 'listening on production';
}

app.engine('html', require('ejs').renderFile);

//issue with express.static with url rewrite
// there is a hardcoded path to css file in home, error and complete views
app.use(express.static(__dirname + '/public'));

app.use(
	session({
		secret: 'keyboard dog',
		resave: false,
		saveUninitialized: false,
		expires: new Date(Date.now() + hour)
	})
);

app.get(webPath + '/', function(req, res) {
	res.render(__dirname + '/views/home.ejs', homeObject);
});

//Object to be passed to home view
var homeObject = {
	log: '',
	webPath: webPath,
	splitters: [ [ config.extract.title, config.extract.url ] ]
};

//Splitter Routes
var extractRouter = require('./Splitters/ExtractTransactions.js');
app.use(webPath + config.extract.url, extractRouter);

app.listen(port, function() {
	console.log(message);
});
