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
var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});
google.authorize(function () {
	var accessToken = google.getAccessToken();
	var metadata = {
		snippet: {
			playlistId: "WL", //specifically works for WatchLater list,
			//but a playlist ID can be used too
			resourceId: {
				kind: "youtube#video",
				videoId: "Jgpp6xnqMg0"
			},
		}
	};
	$.ajax({
		method: "POST",
		url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
		data: JSON.stringify(metadata),
		headers: {
			Authorization: 'Bearer ' + accessToken
		},
		contentType: 'application/json',
	}).done(function (data, textStatus, request) {
		console.log("in success of ajax call, data: ", data);
	});
});
$(document).ready(function () {});
