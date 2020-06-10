import fs from 'fs';
import path from 'path';

const deleteFiles = () => {
	var directory = path.resolve('../api/download');

	return new Promise(function (resolve, reject) {
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

export default deleteFiles;
