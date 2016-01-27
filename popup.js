var formHandler = {
	numberofLinks: null,
	existingPlaylist: false,
	existingName: '',
	newName: '',
	idArray: '',
	newPlaylistID: '',
	validFBurl: function validFBurl(enteredURL) {
		var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
		if(!enteredURL.match(FBurl)) {
			$('.error-message').show();
		} else {
			$('.error-message').hide();
			chrome.tabs.executeScript(null, {
				file: "jquery-1.11.2.min.js"
			}, function () {
				chrome.tabs.executeScript(null, {
					file: "contentScript.js"
				});
			});
		}
	},
	ajaxCall: function ajaxCall() {},
	init: function init() {
		$('.existing').hide();
		$('.new').hide();
		$('input[type="radio"]').click(function () {
			if($('.newPlaylist[value="yes"]').is(":checked")) {
				$('.existing').slideDown();
				$('.new').slideUp();
			} else {
				$('.existing').slideUp();
				$('.new').slideDown();
			}
		});
		$('#go').on('click', function () {
			$('.loader-container').fadeIn();
			google.authorize(function () {
				chrome.storage.local.clear(function () {
					var error = chrome.runtime.lastError;
					if(error) {
						console.error(error);
					}
				});
				formHandler.numberofLinks = $('option:selected').html();
				formHandler.numberofLinks = parseInt(formHandler.numberofLinks);
				if($('.existingPlaylist[value="yes"]').is(":checked")) {
					formHandler.existingPlaylist = true;
				} else {
					formHandler.existingPlaylist = false;
				}
				formHandler.existingName = $('input[name="oldPlaylist"]').val();
				formHandler.newName = $('input[name="playlistName"]').val();
				(function () {
					//make the AJAX request with the given data from the `ajaxes` array of objects
					var accessToken = google.getAccessToken();
					var metadata = {
						snippet: {
							title: formHandler.newName
						}
					};
					$.ajax({
						method: "POST",
						url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
						data: JSON.stringify(metadata),
						headers: {
							Authorization: 'Bearer ' + accessToken
						},
						contentType: 'application/json',
					}).done(function (data, textStatus, request) {
						console.log("Playlist created, data: ", data, request);
						formHandler.newPlaylistID = data.id;
						console.log(formHandler.newPlaylistID);
					});
				})();
				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, function (tab) {
					//Be aware that `tab` is an array of Tabs
					console.log(tab[0].url);
					formHandler.validFBurl(tab[0].url);
				});
				chrome.runtime.onConnect.addListener(function (port) {
					port.postMessage({
						numberofLinks: formHandler.numberofLinks,
						existingPlaylist: formHandler.existingPlaylist,
						newName: formHandler.newName,
						existingName: formHandler.existingName
					});
				});
				chrome.storage.onChanged.addListener(function (changes, namespace) {
					console.log("change received!");
					setTimeout(function () {
						chrome.storage.local.get('value', function (obj) {
							console.log('value', obj);
							formHandler.idArray = obj.value;
							console.log(obj.value.length);
							console.log(formHandler.idArray);
							console.log('running list insert');
							(function () {
								//setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
								var ajaxes = [],
									current = 0;
								(function ajaxArray() {
									for(var i = 0; i < formHandler.idArray.length; i++) {
										var accessToken = google.getAccessToken();
										var metadata = {
											snippet: {
												playlistId: formHandler.newPlaylistID,
												resourceId: {
													kind: "youtube#video",
													videoId: formHandler.idArray[i]
												},
											}
										};
										console.log(formHandler.idArray[i]);
										ajaxes.push(metadata);
									}
								})();
								//declare your function to run AJAX requests
								function do_ajax() {
									console.log(ajaxes[current].snippet.resourceId.videoId);
									//check to make sure there are more requests to make
									if(current < ajaxes.length) {
										console.log(ajaxes[current]);
										var accessToken = google.getAccessToken();
										var percentage = current / ajaxes.length;
										//make the AJAX request with the given data from the `ajaxes` array of objects
										$.ajax({
											method: "POST",
											url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
											data: JSON.stringify(ajaxes[current]),
											headers: {
												Authorization: 'Bearer ' + accessToken
											},
											contentType: 'application/json',
											success: function (serverResponse) {
												//increment the `current` counter and recursively call this function again
												current++;
												$('.loader-running').css({
													'width': (294 * percentage)
												});
												if(current == (ajaxes.length - 1)) {
													$('.loader-running').css({
														'width': 294
													});
													console.log('if');
												} else {
													$('.loader-running').css({
														'width': (294 * percentage)
													});
													console.log('else');
												}
												do_ajax();
											},
											error: function (serverResponse) {
												current++;
												if(current == (ajaxes.length - 1)) {
													$('.loader-running').css({
														'width': 294
													});
													console.log('if');
												} else {
													$('.loader-running').css({
														'width': (294 * percentage)
													});
													console.log('else');
												}
												do_ajax();
											}
										}).done(function (data, textStatus, request) {
											console.log("Song added, data: ", data, request);
											if(current == (ajaxes.length - 2)) {
												$('.loader-running').css({
													'width': 294
												});
												$('.loader').removeClass('loader-running');
												$('.loader-container').fadeOut();
												$('.success-message').fadeIn('fast');
											}
										});
									}
								}
								//run the AJAX function for the first time once `document.ready` fires
								do_ajax();
							})();
						});
					}, 600);
				});
			});
		});
	}
};
var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});
$(document).ready(function () {
	formHandler.init();
});
