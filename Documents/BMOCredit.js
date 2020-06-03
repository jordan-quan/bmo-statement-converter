var parsePDF = require('../helpers/parsePDF.js');
var toExcel = require('../helpers/writeToExcel.js');
var deleteDownloadContents = require('../helpers/delete.js');

const directory = 'test';

module.exports = CreditExtractor;
var transactionTable = [];
var dateFormat = {
	Dec: '12',
	Jan: '01',
	Feb: '02',
	Mar: '03',
	Apr: '04',
	May: '05',
	Jun: '06',
	Jul: '07',
	Aug: '08',
	Sep: '09',
	Oct: '10',
	Nov: '11'
};

async function CreditExtractor(files, title) {
	//delete whatever is in download folder

	transactionTable = [];

	for (i in files) {
		var file = files[i];
		var filePath = file[1].path;

		if (filePath) {
			var promises = [ parsePDF(filePath), deleteDownloadContents() ];
			var [ pageList ] = await Promise.all(promises);
			if (pageList == undefined) {
				throw 'Invalid file type please select a pdf.';
			}
			//main function call
			getTransactions(createMaster(pageList));
		}
	}

	console.log(transactionTable);
	toExcel(transactionTable, 'Sheet 1', title);
}

function formatDate(monthDay, year) {
	var [ month, day ] = monthDay.split('.');
	var date = new Date(`${year}-${month}-${day.trim()}`);
	return date;
}

function isFilled(list) {
	for (i in list) {
		var value = list[i];
		if (value == null) {
			return false;
		}
	}
	return true;
}

function getTable(pageList, table, indexes, statementDate) {
	var scopeStack = [];
	var index = indexes[table];
	var second = false;
	var description = '';
	var referenceNumber = '';
	var amount = '';
	var transferCase = false;
	var interestCase = false;
	var currentState = [ null, null, null, null, null ];
	var year = '';

	for (var line = 0; line < pageList.length; line++) {
		var lineContent = pageList[line];

		if (statementDate == null) {
			if (lineContent.match(/^Statement Date$/m)) {
				statementDate = pageList[line + 1];
				year = statementDate.split(',')[1].trim();
			}
		}

		if (line > index && statementDate != null) {
			//Find date in transaction \ start
			//After Dates are filled
			if (currentState[0] != null && currentState[1] != null) {
				if (currentState[3] != null) {
					amount += lineContent;
					if (amount.match(/^[1-9][0-9]*\.[0-9]{2}$|^[0-9]\.[0-9]{2}$/m)) {
						currentState[4] = amount;
						amount = '';
						if (pageList[line + 1] == 'CR') {
							currentState[4] = '-' + currentState[4];
							line++;
						}
					}
				} else {
					if (lineContent.match(/TRSF FROM/)) {
						transferCase = true;
					}

					if (lineContent.match(/INTEREST PURCHASES/)) {
						interestCase = true;
					}

					if ((lineContent.match(/^[0-9]+$/m) && description != '') || (transferCase && description != '')) {
						referenceNumber += lineContent;
					} else {
						description += ' ' + lineContent;
					}

					if (interestCase) {
						referenceNumber = 'XXXXXXXXXXX';
					}

					if (referenceNumber.length == 11 || referenceNumber.length == 12) {
						currentState[2] = description.trim();
						description = '';
						currentState[3] = referenceNumber.trim();
						referenceNumber = '';
					}
				}
			}

			//Extract dates "Dec. 13" \n "Dec. 15"
			if (lineContent.match(/^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m)) {
				if (second) {
					currentState[1] = formatDate(lineContent, year);
					second = false;
				} else {
					currentState[0] = formatDate(lineContent, year);
					second = true;
				}
			}

			//Extract dates "Dec. 13     Dec.15"
			if (lineContent.match(/^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}(\s)+[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m)) {
				var [ firstDate, ...rest ] = lineContent.split(/(\s)(\s)+/);
				currentState[0] = formatDate(firstDate, year);
				currentState[1] = formatDate(rest.pop(), year);
			}

			if (isFilled(currentState)) {
				transactionTable.push(currentState);
				currentState = [ null, null, null, null, null ];
				specialCase = false;
				interestCase = false;
				transferCase = false;
			}

			if (table < indexes.length - 1) {
				if (line > indexes[table + 1]) {
					break;
				}
			}
		}
	}
}

//Merges pages to create one big array
function createMaster(pageList) {
	var masterPage = [];
	for (page in pageList) {
		var pageContent = pageList[page];
		masterPage = masterPage.concat(pageContent);
	}
	return masterPage;
}

// return object containing all documents transactions
function getTransactions(pageList) {
	var statementDate = null;
	var startTables = findTransIndex(pageList);
	for (var tableIndex = 0; tableIndex < startTables.length; tableIndex++) {
		getTable(pageList, tableIndex, startTables, statementDate);
	}
}

//finds the index of the transaction tables
function findTransIndex(pageContent) {
	var startTables = [];
	for (var line = 0; line < pageContent.length; line++) {
		var lineContent = pageContent[line];

		if (lineContent.match(/PERIOD COVERED BY THIS STATEMENT/)) {
			startTables.push(line);
		}
	}
	return startTables;
}
