var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});

var initiator = {
	newLinkNumber: null,
	accessToken: null,
	validFBurl: function validFBurl(enteredURL) {
		var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
		if(!enteredURL.match(FBurl)) {
			$('.error-message').show();
			$('.scanner-loader-container').hide();
		} else {
			$('.error-message').hide();
			chrome.tabs.executeScript(null, {
				file: "jquery-1.11.2.min.js"
			}, function () {

				chrome.tabs.executeScript(null, {
					file: "https://apis.google.com/js/client.js?onload=init"
				});
				chrome.tabs.executeScript(null, {
					file: "oauth2/oauth2.js"
				});
				chrome.tabs.executeScript(null, {
					file: "oauth2/adapters/google.js"
				});
				chrome.tabs.executeScript(null, {
					file: "contentScript.min.js"
				});
				chrome.tabs.insertCSS(null, {
						file: "popStyle.css"
				});
				chrome.tabs.insertCSS(null, {
						file: "popStyle.css"
				});
			});
		}
	},
};

$(document).ready(function () {
	google.authorize(function () {

		var accessToken = google.getAccessToken();
		setTimeout(function() {
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
