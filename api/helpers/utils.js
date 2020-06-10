// finds all match indexes of specific regex
// param: pageContent [ string ] (list of lines from pdf)
// param: regex [ regex ]
// returns [int] (index of all matches)
export function findIndexes(lines, regex) {
  var indexTable = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(regex)) indexTable.push(i);
  }

  return indexTable;
}

// turns date string into Date object
// param: monthDay string (ex. Dec. 13)
// param: year string (ex. 2020)
// return Date Object
export function formatDate(monthDay, year) {

  var [month, day] = monthDay.split('.');
  var date = new Date(`${year}-${month}-${day.trim()}`);
  return date;
}

// Checks if a list is full
// param: list [ string ]
// returns boolean
export function isListFull(list) {
  for (var i in list) {
    var value = list[i];
    if (value == null) {
      return false;
    }
  }
  return true;
}

// Merges pages to create one big array
// param: pageList [ [ string ] ] 
// returns [ string ]
export function consolidate(list) {
  var bigList = [];

  for (var array in list) {
    var page = list[array];
    bigList = bigList.concat(page);
  }

  return bigList;
}