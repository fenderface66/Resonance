// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	chrome.tabs.query(queryInfo, function (tabs) {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];
		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		var url = tab.url;
		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		// console.assert(typeof url == 'string', 'tab.url should be a string');
		callback(url);
	});
	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, function(tabs) {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
}
/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */

var google = new OAuth2('google', {
	client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
	client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
	api_scope: 'https://www.googleapis.com/auth/youtube',
});

google.authorize(function () {});

var formHandler = {
	numberofLinks: null,
	existingPlaylist: false,
	existingName: '',
	newName: '',
	auth: function auth() {
			console.log('running');
			var TASK_CREATE_URL = 'https://www.googleapis.com/youtube/v3/playlists';
	    // Make an XHR that creates the task

	    var xhr = new XMLHttpRequest();
			console.log(xhr.readyState);
	    xhr.onreadystatechange = function(event) {
				console.log(xhr.readyState);
				console.log(xhr.status);
	      if (xhr.readyState == 4) {
					console.log('here');
	        if(xhr.status == 200) {
						console.log('now here');
	          // Great success: parse response with JSON
	          var task = JSON.parse(xhr.responseText);
	          // form.style.display = 'none';
	          // success.style.display = 'block';

	        } else {
	          // Request failure: something bad happened
	        }
	      }
	    };

	    // var message = JSON.stringify({
	    //   title: task
	    // });

	    xhr.open('POST', TASK_CREATE_URL, true);

	    xhr.setRequestHeader('Content-Type', 'application/json');
	    xhr.setRequestHeader('Authorization', 'OAuth ' + google.getAccessToken());
	    xhr.send('');
	  },
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
			formHandler.auth();
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
$(document).ready(function () {
	getCurrentTabUrl(function (url) {});
	formHandler.init();
});
