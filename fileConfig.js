/*

To add a new document
1. Create module in document folder
2. import module in fileConfig.js
3. Add to respective mapping

To add a new splitter
1. create splitter router in Splitters Folder
3. change change session variable eg. req.session.validStudent -> req.session.valid[new Splitter]
3. add splitter config info and change reference in the module
4. add routes and item to homeObject in index.js

*/

//require all document types
var InfoForm = require('./Documents/InfoForm.js');

module.exports = {
	//flag to change output path
	debug: true,

	//Associate splitter config info
	extract: {
		users: [ [ 'jordan', 'password' ] ],
		title: 'Transaction Extractor',
		url: '/extract',
		destination: '\\\\ohhllp.com\\Root\\APP\\ASREV\\associates',
		//"\\\\ts-devdt-sp13\\c$\\Users\\jquan\\Desktop\\Splitter\\PDFSplitterWeb\\Output\\Associates"
		debugPath: '\\\\ts-devdt-sp13\\c$\\TFS_Jordan\\SplitterOutput\\associate',

		//mappings from documents types in dropdowns to functions used to split document
		mapping: [ [ 'Info Form', InfoForm ] ]
	}
};
