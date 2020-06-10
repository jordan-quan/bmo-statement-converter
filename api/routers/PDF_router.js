import formidable from 'formidable'
import express from 'express';
var router = express.Router();
import extractor from '../Documents/BMOCredit.js'

//downloads file from download folder
router.get('/download', function (req, res) {
	var title = req.query.title;
	res.download('../download/' + title + '.xlsx', (err) => {
		console.log(err);
	});
});


router.post('/pdftoexcel', function (req, res) {

	//initialize variables
	var form = new formidable.IncomingForm();
	form.parse(req);

	var files = [];
	var title;

	//adds user selected files to file array
	form.on('file', function (field, file) {
		files.push([field, file]);
	});

	//parses file title from form
	form.on('field', function (name, value) {

		if (name == 'title') {
			console.log(value);
			title = value;
		}

		if (name == 'files') {
			console.log(value);
		}

	});

	form.on('end', function () {

		extractor(files, title)
			.then(() => {
				console.log("success");
				res.send("success");
			})
			.catch((e) => {
				console.log(e)
				res.send("error");
			});

	});

});

export default router;
