//Object for establishing GET/POST requests to node server
var nodeData = {
  //Empty object for delivering POST requests     
  vData: {

  },
  //Gets Data from Youtube with video ID from Resonance. Places received data in vData for POST request
  getTitle: function getTitle(itemId, group) {
    q = 'https://www.googleapis.com/youtube/v3/videos?id=' + itemId + '&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4&fields=items(snippet)&part=snippet';
    
    $.ajax({
      url: q,
      dataType: "jsonp",
      success: function (data) {
        nodeData.vData = {
            id: itemId,
            title : data.items[0].snippet.title,
            group : group,
        };
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
  //Ajax functions 
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
  //Initialize function sets listener on chrome storage and runs ajaxes once storage containes new data.
  init: function init() {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      var dataV;
      console.log('Changed');
      chrome.storage.local.get('value', function (obj) {
        dataV = obj.value[0];
        group = obj.value[2]
        console.log(obj);
        for (var i = 0; i < dataV.length; i++) {
          nodeData.getTitle(dataV[i], group)
        }
      });
    });
  }
}

//Object for initializing Resonance on icon click
var initiator = {
  newLinkNumber: null,
  accessToken: null,
  //Check to see if current tab is on Facebook. 
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


//On page load
$(document).ready(function () {
  //On icon click
  chrome.browserAction.onClicked.addListener(function (tab) {
    nodeData.vData = {}
    //Get the authorisation token from Google
    chrome.identity.getAuthToken({
      'interactive': true
    }, function (token) {
      var accessToken = token
      setTimeout(function () {
        //Send the authorisation token to content script
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
  //Initialize node object
  nodeData.init();
})
