function userFeedback(feedbackMessage) {
    return function() {
        // Provides feedback for the user.

        if (typeof chrome.runtime.lastError !== 'undefined') {
            feedbackMessage = chrome.runtime.lastError;
        }

        var userFeedback = document.getElementById('user-feedback');
        userFeedback.textContent = feedbackMessage;
        setTimeout(function() {
            userFeedback.textContent = '';
        }, 750);
    }
}

// Saves options to chrome.storage
function saveOptions() {
    var history = document.getElementById('history').checked;
    chrome.storage.sync.set({
        history: history
    }, userFeedback('Options saved.'));
}

// Restores state using the preferences stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(['history', 'historyItems'], function showSavedItems(items) {

        document.getElementById('history').checked = items.history;

        var historyItems = items.historyItems;
        if (historyItems.length === 0) {
            return;
        }

        var ul = document.createElement('ul');
        for (var i = 0; i < historyItems.length; i++) {
            var item = historyItems[i];
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(item));
            ul.appendChild(li);
        }
        document.getElementById('saved-items').appendChild(ul);
    });
}

function clearHistory() {
    chrome.storage.sync.remove(['history', 'historyItems'], userFeedback('History removed!'));
    document.getElementById('history').checked = false;
    document.getElementById('saved-items').innerHTML = '';

    chrome.alarms.create('initialize-history-items', {when: Date.now()})
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear-history').addEventListener('click', clearHistory);
