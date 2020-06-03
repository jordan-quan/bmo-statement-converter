const fs = require('fs');
const path = require('path');

module.exports = () => {
	var directory = __dirname + '/../download';
	return new Promise(function(resolve, reject) {
		fs.readdir(directory, (err, files) => {
			if (err) throw err;

			for (const file of files) {
				fs.unlink(path.join(directory, file), (err) => {
					if (err) throw err;
				});
			}

			resolve('finished deleting files');
		});
	});
};
