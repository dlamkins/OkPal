function isChromeExtension() {
    return typeof chrome !== "undefined" && typeof chrome.storage !== "undefined";
}

export { isChromeExtension }