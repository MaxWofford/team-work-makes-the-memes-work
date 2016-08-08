// This code is trash. Do not use as a reference. You have been warned.

var contexts = ['image', 'video', 'link'];
// Copy logic
chrome.contextMenus.create({
  id: 'Rememeber this',
  title: 'Rememeber this',
  contexts: contexts
});

// Listeners
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // Copy link
  if (info.menuItemId && info.menuItemId == 'Rememeber this') {
    var src = info.srcUrl || info.linkUrl;
    chrome.tabs.sendMessage(tab.id, {
        type: 'prompt'
      }, function(response) {
        var tags = response.split(',');
        for (var i = 0; i < tags.length; i++) {
          var tag = tags[i].trim();
          addTagToPasteListener(tag);
        }
        getFromStorageThen(function(args) {
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if (!args.obj.savedLinks) {
              args.obj.savedLinks = {tags: {}, links: {}};
            }
            args.obj.savedLinks.tags['tag_' + tag] = src;
            args.obj.savedLinks.links['src_' + src] = tag;
          }
          chrome.storage.sync.set(args.obj);
        });
      });
  }
  // Paste link
  if (info.menuItemId && info.menuItemId.match(/tag_/)) {
    getFromStorageThen(function(args) {
      var src = args.savedLinks.tags['tag_' + info.menuItemId.replace(/tag_/, '')];
      chrome.tabs.sendMessage(tab.id, {
        src: src,
        type: 'insert'
      }, function(response) {
        console.log(response);
      });
    });
  }
});

// Paste logic
var storedData = getFromStorageThen(function(args) {
  for (var i = 0; i < args.tags.length; i++) {
    var tag = args.tags[i];
    addTagToPasteListener(tag);
  }
  return args.obj;
});

function addTagToPasteListener(tag) {
  chrome.contextMenus.create({
    id: 'tag_' + tag,
    title: 'Paste ' + tag,
    contexts: ['editable']
  });
}

function getFromStorageThen(callback) {
  chrome.storage.sync.get('savedLinks', function(obj) {
    var savedLinks = {};
    if (obj.savedLinks) {
      savedLinks = obj.savedLinks;
    }
    var tags = Object.keys(savedLinks);
    return callback({obj: obj, savedLinks: savedLinks, tags: tags});
  });
}
