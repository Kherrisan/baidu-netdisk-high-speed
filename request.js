chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const xhr = new XMLHttpRequest();
    xhr.open(details.method, details.url, false);
    if ("POST" === details.method) {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      var params = "";
      for (var name in details.requestBody.formData) {
        params += name + "=" + details.requestBody.formData[name] + "&"
      }
      xhr.send(params);
    } else {
      xhr.send();
    }
    const result = JSON.parse(xhr.responseText);

    if (0 !== result.errno) {
      return {cancel: false};
    }

    var url = "";
    // TODO https://greasyfork.org/zh-CN/scripts/23635-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B/code
    if (result.dlink) {
      if (result.dlink instanceof Array) {
        url = result.dlink[0].dlink;
      } else {
        url = result.dlink;
      }
    } else if (result.list && result.list instanceof Array) {
        url = result.list[0].dlink;
    }
    if(url === '' || !url) {
      return {cancel: false};
    }

    chrome.tabs.create({
      'url': chrome.extension.getURL("url.html"),
      'active': true
    }, function (tab) {
      var selfTabId = tab.id;
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == "complete" && tabId == selfTabId) {
          var tabs = chrome.extension.getViews({type: "tab"});
          tabs[0].setURL(url);
        }
      });
    });

    return {cancel: true};
  },
  {urls: ["*://*.baidu.com/api/*download?*"]},
  ["blocking", "requestBody"]
);