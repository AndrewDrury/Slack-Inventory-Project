var url = "https://hooks.slack.com/services/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"; //link to incoming webhook for webhook_test channel
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheetByName("Master"); // "Master" is what the sheet is labelled (look at bottom of google sheet)


// time stamp the last column when item is signed out
function timeStampSignOut(){
  var row = 3; //PICK THE ROW TO TIME STAMP - EVENTUALLY INCLUDE IN PARAMETERS OF FUNC WHEN USER SIGNS ITEM OUT

  // create timestamp to mark when communication was sent
  var timestamp = new Date();
  sheet.getRange(row,6,1,1).setValue(timestamp);
}

// user searches for item in inventory
function search() {
  var uniqueID = 42854; // UNIQUE ID SHOULD BE SET TO WHAT USER SEARCHES (once we figure out how to get cutom commands working)
  
  // Search for item
  var row = 2; // items start at 2nd row
  var lastRow = sheet.getLastRow();
  var rowRange = lastRow-1;
  var allUniqueIDs = sheet.getRange(row,1,rowRange,1).getValues();
  var foundID = false;

  for (; row<=lastRow && !foundID; row++) {
    if(uniqueID == sheet.getRange(row,1,1,1).getValue()) {
      foundID = true;
      row--;
    }
  }
  
  if(!foundID)
    sendErrorNotFound(uniqueID);
  else {     
    var startCol = 1;
    var totRows = 1;
    var totCols = 6;
    
    var item = sheet.getRange(row,startCol,totRows,totCols).getValues();
    
    // send first item to slack
    sendItemToSlack(item);
   }
 }



// search item not found, send error to Slack
function sendErrorNotFound(errorID) {  
  var payload = {
    "channel": "#webhook_test",
    "text": "Hi homedawg" +
      "\n The ID " + errorID + " was not found. :’(\n" +
      "\n \n Sent care of the Innovation team. Innovating since 2018. ;)"
  };
 
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  return UrlFetchApp.fetch(url,options);
}



// send searched item to Slack
function sendItemToSlack(item) {
  var signOutOn = "N/A";
  var teamMember = "N/A";
  
  if(item[0][3] == "No") {
    signOutOn = item[0][5];
    teamMember = item[0][4];
  }
  
  var payload = {
    "channel": "#webhook_test",
    "text": "Hi homedawg" +
      "\n Your item was found:\n" +
      "\n Unique ID: " + item[0][0] +
      "\n Item Name: " + item[0][1] +
      "\n Sub Team: " + item[0][2] +
      "\n Available: " + item[0][3] +
      "\n Team Member: " + teamMember +
      "\n Signed Out On: " + signOutOn +
      "\n \n Sent care of the Innovation team. Innovating since 2018. ;)"
  };
 
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  return UrlFetchApp.fetch(url,options);
}


// sign all items in
function signAllItemsIn() {
  var startRow = 2;
  var lastRow = sheet.getLastRow();
  var userNameCol = 5;
  var availableCol = 4;
  
  sheet.getRange(startRow,userNameCol,lastRow-1,2).setValue("");
  sheet.getRange(startRow,availableCol,lastRow-1,1).setValue("Yes");
}
