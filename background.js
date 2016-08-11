var nodeData = {

  vData: {

  },

  getTitle: function getTitle(itemId) {
    q = 'https://www.googleapis.com/youtube/v3/videos?id=' + itemId + '&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4&fields=items(snippet)&part=snippet';

    $.ajax({
      url: q,
      dataType: "jsonp",
      success: function (data) {
        nodeData.vData[itemId] = data.items[0].snippet.title;
        console.log(data);
        console.log(name);
        console.log(nodeData.vData);
        nodeData.ajaxCall(nodeData.vData);
        nodeData.vData = {}
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus, +' | ' + errorThrown);
      }
    });
  },

  ajaxCall: function ajaxCall(values) {
    console.log('Running post for Node');
    $.ajax({
      method: "POST",
      dataType: 'json',
      data: values,
      url: "http://139.59.190.164:3000",
    }).done(function (data, textStatus, request) {
      console.log("Finished");
    });
    $.ajax({
      method: "GET",
      url: "http://139.59.190.164:3000/tagId/1234",
    }).done(function (data, textStatus, request) {
      console.log("GET Finished");
      console.log(data);
    });

  },

  init: function init() {
    console.log('running main');


    chrome.storage.onChanged.addListener(function (changes, namespace) {
      var dataV;
      console.log('Changed');
      chrome.storage.local.get('value', function (obj) {
        dataV = obj.value[0];
        for (var i = 0; i < dataV.length; i++) {
          nodeData.getTitle(dataV[i])
          
        }
        //        nodeData.ajaxCall(nodeData.vData);
      });
    });
  }
}

var initiator = {
  newLinkNumber: null,
  accessToken: null,
  validFBurl: function validFBurl(enteredURL) {
    var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
    if (!enteredURL.match(FBurl)) {
      $('.error-message').show();
      $('.scanner-loader-container').hide();
    } else {
      console.log('success');
      $('.error-message').hide();
      chrome.tabs.executeScript(null, {
        file: "jquery-1.11.2.min.js"
      }, function () {
        chrome.tabs.executeScript(null, {
          file: "contentScript.min.js"
        });
        chrome.tabs.insertCSS(null, {
          file: "popStyle.css"
        });
      });
    }
  }
};



$(document).ready(function () {
  chrome.browserAction.onClicked.addListener(function (tab) {
    nodeData.vData = {}
    chrome.identity.getAuthToken({
      'interactive': true
    }, function (token) {
      var accessToken = token
      setTimeout(function () {
        chrome.runtime.onConnect.addListener(function (port) {
          port.postMessage({
            greeting: 'hello',
            accessToken: accessToken,
          });
        });

      }, 100);

      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tab) {
        //Be aware that `tab` is an array of Tabs
        console.log(tab[0].url);
        console.log('working');
        initiator.validFBurl(tab[0].url);
      });

    });
  });

  console.log('running doc');
  nodeData.init();
})
