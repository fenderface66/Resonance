//Object for initializing Resonance on icon click
var initiator = {
  newLinkNumber: null,
  accessToken: null,
  topTen: [],
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
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
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
})
