var formidable = require('formidable');
var config = require('../fileConfig');
var express = require('express');
var router = express.Router();
var htmlpath = '/../views/index.ejs';
var splitterConfig = config.extract;

var webRootPath = '';

if (!config.debug) {
	webRootPath = config.webPath;
}

//use assets in PDFSplitterWeb/public folder
router.use(express.static(__dirname + '/../public'));

router.get('/', function(req, res) {
	//render views/index.ejs along with specific splitter information to populate view
	res.render(__dirname + htmlpath, {
		title: splitterConfig.title,
		webPath: webRootPath,
		url: splitterConfig.url,
		reportTypes: splitterConfig.mapping
	});
});

router.get('/download', function(req, res) {
	var title = req.query.title;
	res.download(__dirname + '/../download/' + title + '.xlsx', (err) => {
		console.log(err);
	});
});

router.post('/', function(req, res) {
	var form = new formidable.IncomingForm();

	var files = [];
	var excelTitle = 'Excel';

	form.on('file', function(field, file) {
		files.push([ field, file ]);
	});

	form.on('field', function(name, value) {
		if (name == 'title') {
			console.log(value);
			excelTitle = value;
		}
	});

	form.on('end', function() {
		//set output path
		var destPath;
		if (config.debug) {
			destPath = splitterConfig.debugPath;
		} else {
			destPath = splitterConfig.destination;
		}

		var func = splitterConfig.mapping[0][1];

		if (func == null) {
			console.log('Error Mapping function to Report Type');
		} else {
			//(pdf path, output path, string for filename, audience, query codes, response object to write to page)
			func(files, excelTitle)
				.then(() => {
					res.render(__dirname + '/../views/complete.ejs', {
						destination: destPath,
						url: splitterConfig.url,
						title: excelTitle
					});
				})
				.catch((e) => {
					res.render(__dirname + '/../views/error.ejs', { error: e });
				});
		}
	});

	form.parse(req);
});

module.exports = router;
