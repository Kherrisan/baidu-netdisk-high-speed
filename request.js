chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (0 <= details.url.indexOf("baidupcs.com") && 0 <= details.url.indexOf("/file")) {
      chrome.tabs.query({title: "获取下载链接成功！"}, function (tabs) {
        var tabIds = [];
        for (var i in tabs) {
          tabIds.push(tabs[i].id);
        }

        chrome.tabs.remove(tabIds, function () {
          chrome.tabs.create({
            'url': chrome.extension.getURL("url.html"),
            'active': true
          }, function (tab) {
            var selfTabId = tab.id;
            chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
              if (changeInfo.status == "complete" && tabId == selfTabId) {
                var tabs = chrome.extension.getViews({type: "tab"});
                tabs[0].setURL(details.url);
              }
            });
          });
        });
      });
    }

    return {cancel: true};
  },
  {urls: ["*://*.baidupcs.com/*"]},
  ["blocking", "requestBody"]
);

