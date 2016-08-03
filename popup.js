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
            }, function() {
                chrome.tabs.executeScript(null, {
                    file: "contentScript.min.js"
                });
                chrome.tabs.insertCSS(null, {
                    file: "popStyle.css"
                });
            });
        }
    },
};

$(document).ready(function() {

    chrome.identity.getAuthToken({
        'interactive': true
    }, function(token) {
        var accessToken = token
        setTimeout(function() {
            chrome.runtime.onConnect.addListener(function(port) {
                port.postMessage({
                    greeting: 'hello',
                    accessToken: accessToken,
                });
            });

        }, 100);

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tab) {
            //Be aware that `tab` is an array of Tabs
            console.log(tab[0].url);
            console.log('working');
            initiator.validFBurl(tab[0].url);
        });

    });
});