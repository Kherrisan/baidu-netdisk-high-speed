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

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    for (var i = 0; i < details.requestHeaders.length; i++) {
      if ('User-Agent' === details.requestHeaders[i].name) {
        // 强制模拟 Windows 系统，解决苹果系统不能使用的问题
        details.requestHeaders[i].value = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';
        break;
      }
    }

    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["*://pan.baidu.com/*", "*://yun.baidu.com/*"]},
  ['blocking', 'requestHeaders']
);
