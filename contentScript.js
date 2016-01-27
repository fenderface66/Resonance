(function ($) {
	var gatherURL = {
		receivedData: {
			numberofLinks: null,
			existingPlaylist: null,
			newName: null,
			existingName: null,
			request: function request() {
				var port = chrome.runtime.connect({
					name: "popup.js"
				});
				port.onMessage.addListener(function (message, sender) {
					if(message.numberofLinks > 0) {
						gatherURL.receivedData.numberofLinks = message.numberofLinks;
						gatherURL.receivedData.existingPlaylist = message.existingPlaylist;
						gatherURL.receivedData.newName = message.newName;
						gatherURL.receivedData.existingName = message.existingName;
					}
				});
			}
		},
		videoID: [],
		regexFunctions: {
			topScroller: function topScroller(scrollNumber) {
				$("html, body").animate({
					scrollTop: $(document).height()
				}, 100);
				setTimeout(function () {
					if(gatherURL.videoID.length < scrollNumber) {
						console.log('running second');
						gatherURL.regexFunctions.topScroller(gatherURL.receivedData.numberofLinks);
						gatherURL.regexFunctions.findLink();
					} else if(gatherURL.videoID.length == scrollNumber) {
						console.log(gatherURL.videoID);
						// Save it using the Chrome extension storage API.
						chrome.storage.local.set({
							'value': gatherURL.videoID
						}, function () {
							// Notify that we saved.
							console.log('Settings saved');
						});
					}
				}, 1000);
			},
			extractVideoID: function extractVideoID(url) {
				var matches = url.match("(youtu\.be\\?\/|v=)([a-zA-Z0-9\_\-]+)&?");
				var regExp = '';
				for(var i in matches) {
					if(matches[i].match("^[a-zA-Z0-9\_\-]+$")) {
						regExp = matches[i];
						break;
					}
				}
				var videoID = regExp;
				return videoID;
			},
			findLink: function findLink() {
				$('#contentCol #contentArea #pagelet_group_ .mtm').each(function (i) {
					var youtubeLink = $(this).find('._6m3 .mbs').html();
					var checkYoutube = $(this).find('._6m3 ._59tj ._6lz').text();
					if(checkYoutube == 'youtube.com') {
						if((gatherURL.videoID.length) < gatherURL.receivedData.numberofLinks) {
							//
							console.log(gatherURL.videoID.length);
							var found = jQuery.inArray(gatherURL.regexFunctions.extractVideoID(youtubeLink), gatherURL.videoID);
							if(found >= 0) {
								// Element was found, remove it.
								gatherURL.videoID.splice(found, 1);
							} else {
								// Element was not found, add it.
								if(gatherURL.regexFunctions.extractVideoID(youtubeLink) !== "") {
									gatherURL.videoID.push(gatherURL.regexFunctions.extractVideoID(youtubeLink));
									console.log(gatherURL.regexFunctions.extractVideoID(youtubeLink));
								}
							}
						}
					}
				});
			}
		},
	};
	gatherURL.receivedData.request();
	setTimeout(function () {
		gatherURL.regexFunctions.topScroller(gatherURL.receivedData.numberofLinks);
	}, 10);
})(jQuery);
