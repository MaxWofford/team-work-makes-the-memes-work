chrome.runtime.onMessage.addListener(function(request, sender, respond) {
  if (request.type == 'prompt') {
    respond(promptForTags());
  } else if (request.type == 'insert') {
    respond(insertIntoSelection(request.url));
  }
})

function promptForTags() {
  return prompt('Please enter your comma-delimited tags...');
}

function insertIntoSelection(url) {
  //IE support
  if (document.selection) {
    sel = document.selection.createRange();
    sel.text = url;
  }
  //Firefox and others
  else if (document.activeElement.selectionStart || document.activeElement.selectionStart == '0') {
    var startPos = document.activeElement.selectionStart;
    var endPos = document.activeElement.selectionEnd;
    document.activeElement.value = document.activeElement.value.substring(0, startPos) +
    url +
    document.activeElement.value.substring(endPos, document.activeElement.value.length);
  } else {
    document.activeElement.value += url;
  }
  return 'Pasted ' + url;
}
