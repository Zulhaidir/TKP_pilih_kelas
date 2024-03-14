function onFormSubmit(even) {
  var record_array = [];

  var form = FormApp.openById('id_form');
  var responses = form.getResponses();
  var lastResponse = responses[responses.length - 1];
  var itemResponse = lastResponse.getItemResponses()
  var name = itemResponse[0].getResponse();
  var kelas = itemResponse[1].getResponse()

  record_array.push(name);

  var answer = lastResponse.getItemResponses().slice(2).map(function(a) { 
    return a.getResponse();
  });

  var mChoiceItem = form.getItems().slice(2).map(function(item) {
    return item.asMultipleChoiceItem().getChoices().map(function(choice) {
      return choice.getValue();
    });
  });

  var valueChoice = convertTo2DArray();

  var mappedValues = answer.map(function(choice, index) {
    var choiceIndex = mChoiceItem[index].indexOf(choice);
    var value = valueChoice[index][choiceIndex];
    return value;
  });

  var sum = mappedValues.reduce(function(acc, cur) {
    return acc + cur;
  });
  record_array.push(sum);

  switch(kelas) {
    case "Kelas A":
      spreadsheetId = 'id_spreadsheet_A';
      break;
    case "Kelas B":
      spreadsheetId = 'id_spreadsheet_B';
      break;
  }
  
  // Menampilkan data berupa nama dan total nilai ke spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName('nama_sheet');
  var row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1).setValue(record_array[0]);
  sheet.getRange(row, 2).setValue(record_array[1]);
}

// import Nilai Score Pada Opsi di Spreadsheet
function convertTo2DArray() {
  var spreadsheet = SpreadsheetApp.openById('id_spreadsheet');
  var sheet = spreadsheet.getSheetByName('nama_sheet'); 

  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var dataRange = sheet.getRange(1, 1, lastRow, lastColumn);
  var dataValues = dataRange.getValues();

  var valueChoice = dataValues.map(function(row) {
    return row.map(function(value) {
      return value;
    });
  });
  return valueChoice;
}






