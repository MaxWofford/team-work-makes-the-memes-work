chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'prompt') {
    sendResponse(promptForTags(request.src));
  } else if (request.type == 'insert') {
    sendResponse(insertIntoSelection(request.src));
  }
})

function promptForTags(src) {
  return prompt('Please enter your comma-delimited tags...');
}

function insertIntoSelection(src) {
    //IE support
    if (document.selection) {
        sel = document.selection.createRange();
        sel.text = src;
    }
    //Firefox and others
    else if (document.activeElement.selectionStart || document.activeElement.selectionStart == '0') {
        var startPos = document.activeElement.selectionStart;
        var endPos = document.activeElement.selectionEnd;
        document.activeElement.value = document.activeElement.value.substring(0, startPos) +
            src +
            document.activeElement.value.substring(endPos, document.activeElement.value.length);
    } else {
        document.activeElement.value += src;
    }
  return 'Pasted ' + src;
}
