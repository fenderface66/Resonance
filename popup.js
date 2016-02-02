var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});

var formHandler = {
	numberofLinks: null,
	existingPlaylist: false,
	existingName: '',
	newName: '',
	idArray: '',
	originalList: '',
	newPlaylistID: '',
	receivedLinks: '',
	existingLinks: [],
	idLength: '',
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
			if($('.existingPlaylist[value="yes"]').is(":checked")) {
				console.log('if');
				$('.existing').slideDown();
				$('.new').slideUp();
			} else {
				console.log('else');
				$('.new').slideDown();
				$('.existing').slideUp();
			}
		});
		$('.explain').click(function () {
			$('.explanation').slideToggle();
		});
		$('#go').on('click', function () {
			$('.scanner-loader-container').fadeIn();
			$('.playlistInfo').hide();
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
			var accessToken = google.getAccessToken();
			(function () {
				//make the AJAX request with the given data from the `ajaxes` array of objects
				console.log(formHandler.newName);
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
				console.log('working');
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


					if(formHandler.existingPlaylist === false) {
						$('.playlistName').text(formHandler.newName);
					} else {
						console.log('here');
						// $.get("https://www.googleapis.com/youtube/v3/" + "playlists?part=snippet&id=" + formHandler.existingName + "&key=" + 'AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4', function (data) {
						// 	$('.playlistName').text(data.items[0].snippet.title);
						// 	console.log(data.items[0].snippet.title);
						// });
						if($('.playlistName').text() === '') {
							$('.playlistName').text('Set playlist to public to see playlist name');
						}
					}
					chrome.storage.local.get('value', function (obj) {
						formHandler.idArray = obj.value[0];
						formHandler.idLength = formHandler.idArray.length;
						formHandler.originalList = formHandler.idArray.slice(0);
						console.log(formHandler.originalList);
						console.log(formHandler.idLength);
						formHandler.receivedLinks = obj.value[1];
						if(formHandler.receivedLinks < formHandler.numberofLinks) {
							$('.scanInfo').append('<p>It appears that the total number of links on this page was <strong>' + (formHandler.numberofLinks - formHandler.receivedLinks) + '</strong> links less then what you selected. </p>');
						}
						(function () {
							var ajaxes = [];
							errorCount = 0;
							current = 0;
							currentGet = 0;
							duplicates = [];
							duplicatesFound = false;
							//declare your function to run AJAX requests
							function do_ajax() {
								var newLinkNumber = formHandler.receivedLinks - (errorCount + duplicates.length);
								$('.linkNumber').text(newLinkNumber);
								$('.scanner-loader-container').fadeOut();
								$('.loader-container').fadeIn();
								$('.scanInfo').fadeIn();
								$('.upload-title').fadeIn();
								// $('.duplicates-message').fadeIn();
								$('.numDuplicates').fadeIn();
								$('.duplicates-number').fadeIn();
								$('.duplicates-number').text(duplicates.length);
								formHandler.idLength = formHandler.idArray.length;
								//check to make sure there are more requests to make
								if(current < ajaxes.length) {
									console.log(ajaxes[current]);
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
											errorCount++;
											$('.plural').hide();
											$('.failed-uploads').show();
											// $('.failed-uploads ul').append("<li>" + ajaxes[current]['snippet']['resourceId']['videoId'] + "</li>");
											$('.failed-uploads .errorNumber').html('<strong>' + errorCount + '</strong>');
											console.log(newLinkNumber);
											$('.linkNumber').text(newLinkNumber - errorCount);
											if(errorCount > 1) {
												$('.plural').show();
												$('.plural2').text(' are');
												$('.plural3').text(' have');
											}
											console.log(serverResponse);
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
										console.log(formHandler.idArray);
										if(current == (ajaxes.length - 2)) {
											$('.loader-running').css({
												'width': 294
											});
											$('.loader').removeClass('loader-running');
											$('.loader-container').fadeOut();
											$('.success-message').fadeIn('fast');
											if(formHandler.existingPlaylist === false) {
												$('.success-message a').attr('href', 'https://www.youtube.com/playlist?list=' + formHandler.newPlaylistID);
											} else {
												$('.success-message a').attr('href', 'https://www.youtube.com/playlist?list=' + formHandler.existingName);
											}
										}
									});
								}
							}
							function do_ajaxGet() {
								$('.text-container h3').text('Checking existing playlist for duplicates');
								console.log('ajaxGet has been initialised');
								//check to make sure there are more requests to make
									//make the AJAX request with the given data from the `ajaxes` array of objects
									console.log('original list length: ' + formHandler.originalList.length);
									console.log('original list: ' + formHandler.originalList);
									console.log('currentGet number: ' + currentGet);
									console.log('current videoID: ' + formHandler.originalList[currentGet]);
									$.ajax({
										method: "GET",
										url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + formHandler.existingName + "&videoId=" + formHandler.originalList[currentGet] + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4",
										headers: {
											Authorization: 'Bearer ' + accessToken
										},
										contentType: 'application/json',
									}).done(function (data, textStatus, request) {
										//increment the `current` counter and recursively call this function again
										currentGet++;
										console.log('CurrentGet length: ' + currentGet);
										console.log('formHandler.idLength: ' + formHandler.idLength);
										console.log(formHandler.originalList);
										console.log("Duplicates data: ", data, request);
										console.log(data.items.length);
										if (data.items.length == 1) {
											var found = '';
											console.log('This is a found duplicate id: ' + data.items[0].snippet.resourceId.videoId);
											duplicates.push(data.items[0].snippet.resourceId.videoId);
											console.log(duplicates.length);
											console.log('These are the duplicates so far: ' + duplicates);
											found = jQuery.inArray(data.items[0].snippet.resourceId.videoId, formHandler.idArray);
											console.log('duplicates length: ' + duplicates.length);
											console.log('Links currently in idArray: ' + formHandler.idArray.length);
											if(found >= 0) {
												// Element was found, remove it.
												formHandler.idArray.splice(found, 1);
												console.log('This was removed from idArray: ' + duplicates[duplicates.length - 1]);
												console.log('Links remaining in idArray: ' + formHandler.idArray.length);
												console.log('Remaining Array items: ' + formHandler.idArray);
											}
										}
											if (currentGet < formHandler.originalList.length) {
												console.log('currentGet is still smaller than original length');
												console.log('running ajaxGet');
												do_ajaxGet();
											} else {
												$('.scanner-loader-container').fadeOut();
												if (duplicates.length == formHandler.originalList.length) {
													$('.duplicates-message .all-duplicates').show();
												} else {
													console.log('running do_ajax()');
													(function ajaxArray() {
														for(var i = 0; i < formHandler.idArray.length; i++) {
															var metadata = {
																snippet: {
																	playlistId: formHandler.existingName,
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
													do_ajax();
												}
												$('.duplicates-number').text(duplicates.length);
												if (duplicates.length > 1) {
													$('.plural5').show();
												}
											}
										console.log('done function finished');
									});
							}
							if(formHandler.existingPlaylist !== true) {
								console.log('if wins');
								(function ajaxArray() {
									for(var i = 0; i < formHandler.idArray.length; i++) {
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
								do_ajax();
							} else {
								console.log('else wins');
								do_ajaxGet();
							}

						})();
					});
				}, 600);
			});
		});
	}
};

$(document).ready(function () {
	google.authorize(function () {
		formHandler.init();
	});
});
