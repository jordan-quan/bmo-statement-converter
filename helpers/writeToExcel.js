// Require library
var excel = require('excel4node');

// worksheet.cell(1, 1).number(100);

// worksheet.cell(1, 2).number(200);

// worksheet.cell(1, 3).formula('A1 + B1');

// worksheet.cell(2, 1).string('string');

// worksheet.cell(3, 1).bool(true);

// workbook.write('Excel.xlsx');

module.exports = (transactionTable, sheetName, fileName) => {
	// Create a new instance of a Workbook class
	var workbook = new excel.Workbook();

	// Add Worksheets to the workbook
	var worksheet = workbook.addWorksheet(sheetName);

	var myStyle = workbook.createStyle({
		font: {
			bold: true
		}
	});

	worksheet.cell(1, 1).string('Transaction Date').style(myStyle);
	worksheet.column(1).setWidth(20);
	worksheet.cell(1, 2).string('Posting Date').style(myStyle);
	worksheet.column(2).setWidth(20);
	worksheet.cell(1, 3).string('Description').style(myStyle);
	worksheet.column(3).setWidth(50);
	worksheet.cell(1, 4).string('Reference Number').style(myStyle);
	worksheet.column(4).setWidth(20);
	worksheet.cell(1, 5).string('Amount').style(myStyle);
	worksheet.column(5).setWidth(10);

	//loop through rows
	for (var r = 0; r < transactionTable.length; r++) {
		var row = transactionTable[r];
		var rowIndex = r + 2;

		for (var c = 0; c < row.length; c++) {
			var value = row[c];
			var cellIndex = c + 1;

			if (c == 4) {
				worksheet.cell(rowIndex, cellIndex).number(parseFloat(value));
			} else if (c == 0 || c == 1) {
				worksheet.cell(rowIndex, cellIndex).date(value).style({ numberFormat: 'mmm dd yyyy' });
			} else {
				worksheet.cell(rowIndex, cellIndex).string(value);
			}
		}
	}

	workbook.write('./download/' + fileName + '.xlsx');
};
