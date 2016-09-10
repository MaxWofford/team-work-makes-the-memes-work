'use strict'
// This code is trash. Do not use as a reference. You have been warned.

let contexts = ['image', 'video', 'link'];

// Copy logic
chrome.contextMenus.create({
  id: 'Rememeber this',
  title: 'Rememeber this',
  contexts: contexts
})

// Listeners
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // Copy link
  if (info.menuItemId && info.menuItemId == 'Rememeber this') {
    let url = info.srcUrl || info.linkUrl
    chrome.tabs.sendMessage(tab.id, {
      type: 'prompt'
    }, function(response) {
      let tags = response.split(',')
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i].trim()
        if (!database.hasTag(tag)) {
          addContextButton(tag)
        }
        database.setTag(tag, url)
      }
    });
  }
  // Paste link
  if (info.menuItemId &&
    info.menuItemId.match(/tag_/) &&
    database.hasTag(info.menuItemId.replace('tag_', ''))) {
    let tag = info.menuItemId.replace('tag_', '')
    let url = database.getRandomUrlFromTag(tag)
    let type = 'insert'
    let options = {
      url,
      type
    }
    chrome.tabs.sendMessage(tab.id, options, (resp) => {
      console.log(resp)
    })
  }
});

function updateAllContextButtons() {
  let tags = database.getTags();
  for(let i = 0; i < tags.length; i++) {
    let tag = tag[i]
    addContextButton(tag)
  }
}

function addContextButton(tag) {
  chrome.contextMenus.create({
    id: 'tag_' + tag,
    title: 'Paste ' + tag,
    contexts: ['editable']
  });
}

function Database() {
  this.tags = {}; // This contains the tags as keys
  this.urls = {}; // This contains the URLs as keys

  this.getUrls = function() {
    return Object.keys(this.urls)
  }

  this.getTags = function() {
    return Object.keys(this.tags)
  }

  this.hasTag = function(tag) {
    return this.getTags().indexOf(tag) != -1
  }

  this.getRandomUrlFromTag = function(tag) {
    let urls = this.tags[tag]
    let randomUrl = urls[Math.floor(Math.random() * urls.length)]
    return randomUrl
  }

  this.setUrl = function(url, tags) {
    if(typeof tags != 'array') {
      tags = [tags]
    }
    if(!this.urls[url]) {
      this.urls[url] = []
    }

    this.urls[url] = this.urls[url].concat(tags)
  }

  this.setTag = function(tag, urls) {
    if (typeof urls != 'array') {
      urls = [urls]
    }
    if(!this.tags[tag]) {
      this.tags[tag] = []
    }

    this.tags[tag] = this.tags[tag].concat(urls)
  }
}

let database = new Database()
