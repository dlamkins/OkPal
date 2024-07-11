import { isChromeExtension } from "./common";

function setSettingValue(key, value) {
    if (isChromeExtension()) {
        chrome.storage.sync.set({ [key]: value }, function() {
            console.log('Settings saved to Chrome storage:', key, value);
        });
    } else {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Settings saved to localStorage:', key, value);
    }
}

function getSettingValue(key, callback) {
    if (isChromeExtension()) {
        chrome.storage.sync.get([key], function(result) {
            callback(result[key]);
        });
    } else {
        const value = JSON.parse(localStorage.getItem(key));
        callback(value);
    }
}

export { setSettingValue, getSettingValue };