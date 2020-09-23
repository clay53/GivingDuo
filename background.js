const postLinkRegEx = /^https:\/\/forum.duolingo.com\/comment\/[0-9]+/g;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete" && tab.url.match(postLinkRegEx)) {
        console.log("Found page to inject into.");
        chrome.tabs.executeScript(
            tabId,
            {
                file: "injected.js"
            },
            () => {
                console.log("Script injected.")
            }
        );
    }
});

chrome.webRequest.onBeforeRequest.addListener(details => {
    console.log(details);
    chrome.tabs.sendMessage(
        details.tabId,
        {
            identifier: "LOVE-URL",
            value: details.url
        }
    );
}, {urls: ["https://forum-api.duolingo.com/comments/*/love"]});