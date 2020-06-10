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
//var BMOCredit = require('./Documents/BMOCredit.js');

const config = {
	//flag to change output path
	debug: true,

	//PDF splitter to extract data from bank statements
	extract: {
		users: [['jordan', 'password']],
		title: 'Transaction Extractor',
		url: '/extract',
		destination: '',
		debugPath: '',

		//mappings from documents types in dropdowns to functions used to split document
		//mapping: [['BMO Credit Card Statment', BMOCredit]]
	}
};

export default config;
