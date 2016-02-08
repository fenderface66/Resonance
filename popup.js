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
	nextPageToken: '',
	ajaxGetInitialised: false,
	newLinkNumber: null,
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
							duplicatesFound = [];
							pages = 0;
							//declare your function to run AJAX requests
							function do_ajax() {


								$('.scanner-loader-container').fadeOut();
								$('.loader-container').fadeIn();
								$('.scanInfo').fadeIn();
								$('.upload-title').fadeIn();
								// $('.duplicates-message').fadeIn();
								$('.numDuplicates').fadeIn();
								$('.duplicates-number').fadeIn();
								$('.duplicates-number').text(duplicatesFound.length);
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
											var adjustedCount = formHandler.newLinkNumber - errorCount;
											console.log(adjustedCount);
											$('.linkNumber').text(adjustedCount);
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
											console.log(formHandler.newLinkNumber);
											console.log(errorCount);
											var adjustedCount = formHandler.newLinkNumber - errorCount;
											console.log(adjustedCount);
											$('.linkNumber').text(adjustedCount);
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
												console.log($('.linkNumber').text());
												if ($('.linkNumber').text() == '0') {
													$('.scanner-loader-container').fadeOut();
													$('.upload-title').fadeOut();
													$('.failed-uploads').fadeOut();
													$('.loader-container').fadeOut();
													$('.scanInfo').fadeOut();
													$('.numDuplicates').fadeOut();
													$('.duplicatesAndErrors').show();
												}
												console.log('else');
											}
											if (current < ajaxes.length) {
												do_ajax();
											}
										}
									}).done(function (data, textStatus, request) {
										console.log("Song added, data: ", data, request);
										console.log(formHandler.idArray);
										console.log(current);
										console.log(ajaxes.length);
										if(current == (ajaxes.length - 1)) {
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
							function do_ajaxGetNextPage() {
								console.log('ajaxGet Next page has been initialised');
								//check to make sure there are more requests to make
									//make the AJAX request with the given data from the `ajaxes` array of objects
									$.ajax({
										method: "GET",
										url: "https://www.googleapis.com/youtube/v3/playlistItems?pageToken="+ formHandler.nextPageToken +"&part=snippet&maxResults=50&playlistId=" + formHandler.existingName + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4",
										headers: {
											Authorization: 'Bearer ' + accessToken
										},
										contentType: 'application/json',
									}).done(function (data, textStatus, request) {
										//increment the `current` counter and recursively call this function again

										console.log('CurrentGet length: ' + currentGet);
										console.log('formHandler.idLength: ' + formHandler.idLength);
										console.log(formHandler.originalList);
										console.log("Duplicates data: ", data, request);
										console.log(data.items.length);
										if (data.items.length > 1) {
											var found = '';
											console.log('Existing ID has been pushed to duplicates aray for cross checking: ' + data.items[0].snippet.resourceId.videoId);

											for (var i = 0; i < data.items.length; i++) {
												currentGet++;
												console.log(data);
												console.log(data.items[i].snippet.resourceId.videoId);
												duplicates.push(data.items[i].snippet.resourceId.videoId);
												console.log('These are the existing ids used for cross checking: ' + duplicates);
												console.log('This is the length of the cross checking array:' + duplicates.length);
												console.log('data items length: ' + data.items.length);
												console.log('Current Get length: ' + currentGet);
												if (data.items.length == 50 && currentGet == data.items.length) {
													console.log('End of page reached');

													formHandler.nextPageToken = data.nextPageToken;
													console.log('nextPage Token = ' + data.nextPageToken);
													currentGet = 0;
													do_ajaxGetNextPage();
													pages++;
												}
												else if (currentGet == data.items.length) {
													console.log(duplicates.length);
													for (var g = 0; g < (duplicates.length + 1); g++) {
														found = jQuery.inArray(duplicates[g], formHandler.idArray);
														console.log('iterator length = ' + g);
														if(found >= 0) {
															// Element was found, remove it.
															formHandler.idArray.splice(found, 1);
															duplicatesFound.push(duplicates[g]);
															console.log('This was removed from idArray: ' + duplicates[g]);
															console.log('Links remaining in idArray: ' + formHandler.idArray.length);
															console.log('Remaining Array items: ' + formHandler.idArray);
															console.log('iterator length = ' + g);
															console.log('Cross checking array length = ' + duplicates.length);
														}
														if (g == (duplicates.length)) {
															$('.scanner-loader-container').fadeOut();
															if (formHandler.idArray.length === 0) {
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
																console.log('doing ajax');
																console.log(ajaxes);
																formHandler.newLinkNumber = formHandler.idArray.length;
																do_ajax();
															}
															$('.duplicates-number').text(duplicates.length);
															if (duplicates.length > 1) {
																$('.plural5').show();
															}
														}
													}
												}
											}
										}
										console.log('AjaxGetNext is done');
									});
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
										url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + formHandler.existingName + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4",
										headers: {
											Authorization: 'Bearer ' + accessToken
										},
										contentType: 'application/json',
										error: function (serverResponse) {
											$('.scanner-loader-container').fadeOut();
											$('.invalidPlaylist').fadeIn();

										}
									}).done(function (data, textStatus, request) {
										//increment the `current` counter and recursively call this function again

										console.log('CurrentGet length: ' + currentGet);
										console.log('formHandler.idLength: ' + formHandler.idLength);
										console.log(formHandler.originalList);
										console.log("Duplicates data: ", data, request);
										console.log(data.items.length);
										if (data.items.length > 1) {
											var found = '';
											console.log('Existing playlist ids ' + data.items[0].snippet.resourceId.videoId);

											for (var i = 0; i < data.items.length; i++) {
												currentGet++;
												console.log(data);
												console.log(data.items[i].snippet.resourceId.videoId);
												duplicates.push(data.items[i].snippet.resourceId.videoId);
												console.log('Pushing the following exsting ids into a duplicates array for cross checking: ' + duplicates);
												if (currentGet == data.items.length && currentGet == 50) {
													formHandler.nextPageToken = data.nextPageToken;
													console.log('nextPage Token = ' + data.nextPageToken);
													console.log('End of page reached');
													console.log('next page ajax running');
													currentGet = 0;
													do_ajaxGetNextPage();
												}
												else if (currentGet == data.items.length) {
													console.log(duplicates.length);
													for (var g = 0; g < duplicates.length; g++) {
														found = jQuery.inArray(duplicates[g], formHandler.idArray);
														console.log(g);
														if(found >= 0) {
															// Element was found, remove it.
															formHandler.idArray.splice(found, 1);
															duplicatesFound.push(duplicates[g]);
															console.log('This was removed from idArray: ' + duplicates[g]);
															console.log('Links remaining in idArray: ' + formHandler.idArray.length);
															console.log('Remaining Array items: ' + formHandler.idArray);
														}
														if (g == (duplicates.length -1)) {
															$('.scanner-loader-container').fadeOut();
															if (formHandler.idArray.length === 0) {
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
																console.log('doing ajax');
																console.log(ajaxes);
																formHandler.newLinkNumber = formHandler.idArray.length;
																do_ajax();
															}
															$('.duplicates-number').text(duplicates.length);
															if (duplicates.length > 1) {
																$('.plural5').show();
															}
														}
													}
												}
											}
										}
										console.log('done function finished');
									});
							}
							if(formHandler.existingPlaylist !== true) {
								console.log('if wins');
								formHandler.newLinkNumber = formHandler.idArray.length;
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
								if (formHandler.ajaxGetInitialised === false) {
									do_ajaxGet();
									formHandler.ajaxGetInitialised = true;
									console.log('formHandler.ajaxGetInitialised = ' + formHandler.ajaxGetInitialised);
								}
								else {
									formHandler.newLinkNumber = formHandler.idArray.length;
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
								}
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
