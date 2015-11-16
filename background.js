// Copyright (c) 2015 Marcelo Almeida. All rights reserved.

function openSelectionOnGoogleMaps(info, tab) {
  var url = "https://www.google.com/maps?q=";
  var selectionText = info.selectionText;

  chrome.tabs.create({
    url: url + selectionText
  });

  chrome.storage.sync.get(['history', 'historyItems'], function updateHistory(items) {
    var saveHistory = items.history;
    if (!saveHistory) {
      return;
    }

    var historyItems = items.historyItems;
    chrome.storage.sync.set({
      historyItems: historyItems.concat(selectionText)
    });
  })
}

function navigateToSelection(info, tab) {
  var url = "https://www.google.com.br/maps/dir/rua paraibuna, sao jose dos campos/centervale";

}

// Only install context menus once.
chrome.runtime.onInstalled.addListener(function() {

  chrome.contextMenus.create({
    title: "Open in Google Maps",
    contexts: ["selection"],
    onclick: openSelectionOnGoogleMaps
  });

  //var directionsParent = chrome.contextMenus.create({
  //    "title": "Send to Maps",
  //    "contexts": ["selection"],
  //    "onclick": navigateToSelection
  //});

  chrome.alarms.create('initialize-history-items', {when: Date.now()});
  chrome.storage.local.set({tabsIds: {}});
});
