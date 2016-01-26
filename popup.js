

var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});

google.authorize(function() {});

var formHandler = {
	numberofLinks: null,
	existingPlaylist: false,
	existingName: '',
	newName: '',
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
			formHandler.numberofLinks = $('option:selected').html();
			formHandler.numberofLinks = parseInt(formHandler.numberofLinks);
			if($('.existingPlaylist[value="yes"]').is(":checked")) {
				formHandler.existingPlaylist = true;
			} else {
				formHandler.existingPlaylist = false;
			}
			formHandler.existingName = $('input[name="oldPlaylist"]').val();
			formHandler.newName = $('input[name="playlistName"]').val();
			chrome.tabs.executeScript(null, {
				file: "jquery-1.11.2.min.js"
			}, function () {
				chrome.tabs.executeScript(null, {
					file: "contentScript.js"
				});
			});
			chrome.runtime.onConnect.addListener(function (port) {
				port.postMessage({
					numberofLinks: formHandler.numberofLinks,
					existingPlaylist: formHandler.existingPlaylist,
					newName: formHandler.newName,
					existingName: formHandler.existingName
				});
			});
		});
	}
};

// Define some variables used to remember state.
 var playlistId, channelId;

 // After the API loads, call a function to enable the playlist creation form.
 function handleAPILoaded() {
	enableForm();
 }

 // Enable the form for creating a playlist.
 function enableForm() {
	console.log('form enabled');
 }

 // Create a private playlist.
 function createPlaylist() {
	var request = gapi.client.youtube.playlists.insert({
		part: 'snippet,status',
		resource: {
			snippet: {
				title: 'Test1 Playlist',
				description: 'A private playlist created with the YouTube API'
			},
			status: {
				privacyStatus: 'private'
			}
		}
	});
	request.execute(function(response) {
		var result = response.result;
		if (result) {
			playlistId = result.id;
			console.log(playlistId);
			console.log(result.snippet.title);
			console.log(result.snippet.description);
		} else {
			console.log('Could not create playlist');
		}
	});
 }

 // Add a video ID specified in the form to the playlist.
 function addVideoToPlaylist() {
	console.log('031842');
 }

 // Add a video to a playlist. The "startPos" and "endPos" values let you
 // start and stop the video at specific times when the video is played as
 // part of the playlist. However, these values are not set in this example.
 function addToPlaylist(id, startPos, endPos) {
	var details = {
		videoId: id,
		kind: 'youtube#video'
	}
	if (startPos != undefined) {
		details['startAt'] = startPos;
	}
	if (endPos != undefined) {
		details['endAt'] = endPos;
	}
	var request = gapi.client.youtube.playlistItems.insert({
		part: 'snippet',
		resource: {
			snippet: {
				playlistId: playlistId,
				resourceId: details
			}
		}
	});
	request.execute(function(response) {
		$('.playlistInfo').append('<pre>' + JSON.stringify(response.result) + '</pre>');
	});
 }

 function init() {
	 gapi.client.setApiKey('AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4');
	 gapi.client.load('youtube', 'v3').then(createPlaylist());
 }

$(document).ready(function () {
	formHandler.init();
	
});
