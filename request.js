var gCurrentTab = null;

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(details.url)
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

// if (0 > details.url.indexOf("/api/download") && 0 > details.url.indexOf("/api/sharedownload")) {
//   return {cancel: false};
// }
//
// if (!gCurrentTab) {
//   chrome.tabs.query({
//     currentWindow: true,
//     active: true
//   }, function (tabs) {
//     gCurrentTab = tabs[0];
//     chrome.debugger.attach({
//       tabId: gCurrentTab.id
//     }, "1.0", function () {
//       chrome.debugger.sendCommand({
//         tabId: gCurrentTab.id
//       }, "Network.enable");
//     });
//   });
// }

    return {cancel: false};
  },
  {
    urls: ["*://*.baidupcs.com/*"]
  }
  ,
  ["blocking", "requestBody"]
)
;

chrome.debugger.onEvent.addListener(function (source, method, params) {
    // if (gCurrentTab.id != source.tabId) {
    //   return;
    // }
    //
    // if (method == "Network.loadingFinished") {
    //   var tabId = source.tabId;
    //   var requestId = params.requestId;
    //   chrome.debugger.sendCommand(
    //     source,
    //     "Network.getResponseBody",
    //     {"requestId": requestId},
    //     function (res) {
    //       if (!res || !res.body || 0 > res.body.indexOf("errno")) {
    //         return;
    //       }
    //       const result = JSON.parse(res.body);
    //       if (0 !== result.errno) {
    //         return;
    //       }
    //
    //       var dlink = "";
    //       if (result.dlink) {
    //         if (result.dlink instanceof Array) {
    //           dlink = result.dlink[0].dlink;
    //         } else {
    //           dlink = result.dlink;
    //         }
    //       } else if (result.list && result.list instanceof Array) {
    //         dlink = result.list[0].dlink;
    //       }
    //       if ("" === dlink) {
    //         return {cancel: false};
    //       }
    //
    //       alert(dlink);
    //       chrome.debugger.detach(source);
    //       gCurrentTab = null;
    //
    //       chrome.tabs.create({
    //         'url': chrome.extension.getURL("url.html"),
    //         'active': true
    //       }, function (tab) {
    //         var selfTabId = tab.id;
    //         chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //           if (changeInfo.status == "complete" && tabId == selfTabId) {
    //             var tabs = chrome.extension.getViews({type: "tab"});
    //             tabs[0].setURL(dlink);
    //           }
    //         });
    //       });
    //     });
    // }
  }
);
