import parsePDF from '../helpers/parsePDF.js';
import toExcel from '../helpers/writeToExcel.js';
import deleteDownloadContents from '../helpers/delete.js';
import { findIndexes, formatDate, isListFull, consolidate } from '../helpers/utils.js';


async function CreditExtractor(files, title) {

	//delete whatever is in download folder
	await deleteDownloadContents();
	var transactions = [];

	for (var i in files) {
		var [, { path }] = files[i];

		if (path) {
			var pageList = await parsePDF(path);
			transactions = transactions.concat(getTransactions(consolidate(pageList)));
		}
	}

	toExcel(transactions, 'Sheet 1', title);
}


// return object containing all documents transactions
function getTransactions(pageList) {
	var statementDate = null;
	var transactions = [];

	var tableIndexArray = findIndexes(pageList, /PERIOD COVERED BY THIS STATEMENT/);

	for (var i = 0; i < tableIndexArray.length; i++) {
		const currentTable = getTable(pageList, i, tableIndexArray, statementDate);
		transactions = transactions.concat(currentTable);
	}

	return transactions;
}



// 	/*

// 	TRANS DATE,
//   POSTING DATE,
// 	DESCRIPTION,
// 	REFERENCE NO.,
// 	AMOUNT ($),

// 	*/


// 	var tableValues = {

// 		amount: {
// 			value: null,
// 			regex: [/^[1-9][0-9]*\.[0-9]{2}$|^[0-9]\.[0-9]{2}$/m]
// 		},

// 		description: {
// 			value: null,
// 			regex: []
// 		},

// 		reference: {
// 			value: null,
// 			regex: []
// 		},

// 		transaction: {
// 			value: null,
// 			regex: [/^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m, /^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}(\s)+[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m]
// 		},

// 		posting: {
// 			value: null,
// 			regex: [/^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m, /^[A-Z]{1}[a-z]{2}\. [0-9]{1,2}(\s)+[A-Z]{1}[a-z]{2}\. [0-9]{1,2}$/m]
// 		}

// 	}

function getTable(pageList, table, indexes, statementDate) {
	var transactionTable = [];
	var index = indexes[table];
	var second = false;
	var description = '';
	var referenceNumber = '';
	var amount = '';
	var transferCase = false;
	var interestCase = false;
	var specialCase = false;
	var currentState = [null, null, null, null, null];
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
				var [firstDate, ...rest] = lineContent.split(/(\s)(\s)+/);
				currentState[0] = formatDate(firstDate, year);
				currentState[1] = formatDate(rest.pop(), year);
			}

			if (isListFull(currentState)) {
				transactionTable.push(currentState);
				currentState = [null, null, null, null, null];
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

	return transactionTable;
}


export default CreditExtractor;