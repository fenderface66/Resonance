(function($) {
  // extension:
  $.fn.scrollEnd = function(callback, timeout) {
    $(this).scroll(function() {
      var $this = $(this);
      if ($this.data('scrollTimeout')) {
        clearTimeout($this.data('scrollTimeout'));
      }
      $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
  };

  var createPopup = {
    fn: {
      insert: function() {
        $('#facebook').prepend('<div class="popupMinified"><a class="open">Open</a></div><div class="popupMain"></div>');
        $('.popupMain').fadeIn().prepend('<a class="close">Close</a><a class="minify">Minify</a><div class="notLinkThread"><p>It looks like the thread you selected contains no youtube links</p></div><div class="scanner-loader-container"><div class="text-container"><h3>Now scanning page for links</h3><p>If you&rsquo;ve selected 100 or above links this may take a minute or two</p><p>Please refrain from clicking on the page or changing tabs whilst this is happening</p></div><img class="scanner-loader" src="chrome-extension://odgilfhpppnknabdpicciabekcnpnodj/711.gif" /></div><form class="playlistInfo"><legend>Please Select Resonance Preferences</legend><fieldset><label>Would you like to put these songs into an existing playlist or a newly created one?</label><input class="existingPlaylist" type="radio" name="existingPlaylist" value="yes"> Existing Playlist<br><input class="existingPlaylist" type="radio" name="existingPlaylist" value="no"> New Playlist<br><div class="existing"><label for="oldPlaylist">What is the ID of this playlist?</label><input name="oldPlaylist" type="text" / placeholder="Playlist ID"><span class="explain">?</span><div class="explanation"><p>You can find your playlist ID by going to the playlist page on youtube and extracting it from the url</p><p><span class="explain-header">Example</span> <br><br> https://www.youtube.com/playlist?list=<strong>PLLE1K_p2t-JKUfeaaPCXqu8idT3wsOv4C</strong></p><p>The part in bold is your playlist ID</p>If this playlist is private its name will not appear in the upload info. It will however still have the links uploaded to it</p></div></div><div class="new"><label for="playlistName">Name of new playlist</label><input name="playlistName" type="text" / placeholder="Music Playlist"></div>			<label>Would you like to extract links by number or thread?</label><input class="numThread" type="radio" name="numThread" value="yes"> Number<br><input class="numThread" type="radio" name="numThread" value="no"> Thread<br><div class="linkNumberContainer"><label for="linkNumber">How many links would you like to add</label><select name="linkNumber"><option>5</option><option>10</option><option>20</option><option>30</option><option>40</option><option>50</option><option>60</option><option>70</option><option>80</option><option>90</option><option>100</option><option>200</option></select></div><div class="threadCollecter"><p>Please click on the posts you would like to extract links from. When you are finished click done</p><p>Number of threads: <span class="threadNumber">Click done to see how many threads you have selected.</span></p><div class="doneButton">Done</div></div><div id="go">Let&rsquo;s Go</div></fieldset></form><div class="upload-title"><h2>Uploading Links to Youtube</h2></div><div class="loader-container"><div class="loader loader-running"></div></div><div class="scanInfo"><h3>Info</h3><p><strong>Playlist Name: </strong><span class="playlistName"></span><p><p><strong>Links to be added: </strong><span class="linkNumber"></span><p></div><div class="failed-uploads"><p><span class="errorNumber"></span> video<span class="plural">s</span><span class="plural2"> is</span> invalid and <span class="plural3">has</span> not been uploaded</p></div><p class="error-message">Oops, please make sure you are on a facebook group page before clicking GO</p><div class="duplicates-message"><p class="all-duplicates">It appears that all the links you tried to add already exist in this playlist<p><p class="duplicatesAndErrors">It appears that all the links you tried to add either already exist in this playlist or were invalid links</p><p class="numDuplicates"><span class="duplicates-number"></span> duplicate<span class="plural5">s </span>have been found</p></div><p class="invalidPlaylist">The playlist id you gave seems to be invalid please make sure you have entered it correctly. Refresh and try again</p><div class="success-message"><p>Congratulations! Your playlist is now ready for you</p><a target="_blank" href="">Click here to be taken to it</a></div>');
      }

    },
    init: function() {
      console.log('running insert');
      createPopup.fn.insert();
    }
  };

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
    threadCounter: false,
    validFBurl: function validFBurl(enteredURL) {
      var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
      if (!enteredURL.match(FBurl)) {
        $('.error-message').show();
        $('.scanner-loader-container').hide();
      } else {
        $('.error-message').hide();
        chrome.tabs.executeScript(null, {
          file: "jquery-1.11.2.min.js"
        }, function() {
          chrome.tabs.executeScript(null, {
            file: "contentScript.js"
          });
          chrome.tabs.insertCSS(null, {
            file: "popStyle.css"
          });
        });
      }
    },
    postLister: function postLister() {
      var finished = false;
			var started = false;
			$('.numThread[value="no"]').click(function() {
				started = true;
				console.log(started);
			});

			$('.mbm').click(function() {
				console.log(this);
				console.log(finished);
				console.log(started);
				if (finished === false && started === true) {
					$(this).toggleClass('chosenThread');
				}
			});

			$(document).on('DOMNodeInserted', function(e) {
					if ($(e.target).is('.mbm')) {
						$(e.target).click(function() {
							console.log(this);
							if (finished === false && started === true) {
								$(this).toggleClass('chosenThread');
							}
						});
					}
				});

      $('.doneButton').click(function() {
        finished = true;
        $('.threadNumber').text($('.chosenThread').length);
        $('.chosenThread').each(function() {

          $(this).find('._524d a').click(function() {
            event.preventDefault();
          });
          $(this).find('._524d a span:last-child').trigger('click');
          console.log('running');
          if ($(this).find('.UFIPagerLink').length) {
            console.log('success');
            $(this).find('.UFIPagerLink span').trigger('click');
          }
        });
      });
    },

    popupClose: function() {
      $('.close').click(function() {
        $('.popupMain').remove();
      });
    },

    popupMinify: function() {
      $('.minify').click(function() {
        $('.popupMain').slideUp('fast');
        $('.popupMinified').show();
      });
      $('.open').click(function() {
        $('.popupMain').slideDown('fast');
        $('.popupMinified').hide();
      });
    },

    init: function init() {
      formHandler.postLister();
      formHandler.popupClose();
      formHandler.popupMinify();
      console.log('running formHandler');
      $('.existing').hide();
      $('.new').hide();
      $('.linkNumberContainer').hide();
      $('.threadCollecter').hide();
      $('.existingPlaylist').click(function() {
        if ($('.existingPlaylist[value="yes"]').is(":checked")) {
          console.log('if');
          $('.existing').slideDown();
          $('.new').slideUp();
        } else {
          console.log('else');
          $('.new').slideDown();
          $('.existing').slideUp();
        }
      });
      $('.numThread').click(function() {
        if ($('.numThread[value="yes"]').is(":checked")) {
          console.log('if');
          $('.linkNumberContainer').slideDown();
          $('.threadCollecter').slideUp();
        } else {
          console.log('else');
          $('.threadCollecter').slideDown();
          $('.linkNumberContainer').slideUp();
        }
      });
      $('.explain').click(function() {
        console.log('explain clicked');
        $('.popupMain .explanation').slideToggle();
      });
      $('#go').on('click', function() {
        $('.scanner-loader-container').fadeIn();
        $('.playlistInfo').hide();
        chrome.storage.local.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
            console.error(error);
          }
        });
        formHandler.numberofLinks = $('option:selected').html();
        formHandler.numberofLinks = parseInt(formHandler.numberofLinks);
        if ($('.existingPlaylist[value="yes"]').is(":checked")) {
          formHandler.existingPlaylist = true;
        } else {
          formHandler.existingPlaylist = false;
        }
        formHandler.existingName = $('input[name="oldPlaylist"]').val();
        formHandler.newName = $('input[name="playlistName"]').val();
        if ($('.numThread[value="no"]').is(":checked")) {
          formHandler.threadCounter = true;
        }
        console.log('formHandler.threadCounter = ' + formHandler.threadCounter);
        console.log(formHandler.accessToken);
        var accessToken = formHandler.accessToken;

        (function() {
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
          }).done(function(data, textStatus, request) {
            console.log("Playlist created, data: ", data, request);
            formHandler.newPlaylistID = data.id;
            console.log(formHandler.newPlaylistID);
          });
        })();
        if (formHandler.threadCounter === false) {
          gatherURL.regexFunctions.topScroller(formHandler.numberofLinks);
        } else {
          gatherURL.regexFunctions.findLink();
        }
        chrome.storage.onChanged.addListener(function(changes, namespace) {
          console.log("change received!");
          setTimeout(function() {


            if (formHandler.existingPlaylist === false) {
              $('.playlistName').text(formHandler.newName);
            } else {
              console.log('here');
              $.get("https://www.googleapis.com/youtube/v3/" + "playlists?part=snippet&id=" + formHandler.existingName + "&key=" + 'AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4', function(data) {
                $('.playlistName').text(data.items[0].snippet.title);
                console.log(data.items[0].snippet.title);
              });
              if ($('.playlistName').text() === '') {
                $('.playlistName').text('Set playlist to public to see playlist name');
              }
            }
            chrome.storage.local.get('value', function(obj) {
              formHandler.idArray = obj.value[0];
              formHandler.idLength = formHandler.idArray.length;
              formHandler.originalList = formHandler.idArray.slice(0);
              console.log(formHandler.originalList);
              console.log(formHandler.idLength);
              formHandler.receivedLinks = obj.value[1];
              if (formHandler.receivedLinks < formHandler.numberofLinks && formHandler.threadCounter === false) {
                $('.scanInfo').append('<p>It appears that the total number of links on this page was <strong>' + (formHandler.numberofLinks - formHandler.receivedLinks) + '</strong> links less then what you selected. </p>');
              }
              (function() {
                var ajaxes = [];
                errorCount = 0;
                current = 0;
                currentGet = 0;
                duplicates = [];
                duplicatesFound = [];
                pages = 0;
                finished = false;
                //declare your function to run AJAX requests
                function do_ajax() {
                  if (finished === false) {
                    $('.scanner-loader-container').fadeOut();
                    $('.loader-container').fadeIn();
                    $('.scanInfo').fadeIn();
                    $('.upload-title').fadeIn();
                    // $('.duplicates-message').fadeIn();
                    if (formHandler.existingPlaylist === true) {
                      $('.numDuplicates').fadeIn();
                    }
                    $('.duplicates-number').fadeIn();
                    $('.duplicates-number').text(duplicatesFound.length);
                  }
                  formHandler.idLength = formHandler.idArray.length;
                  //check to make sure there are more requests to make
                  if (current < ajaxes.length) {
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
                      success: function(serverResponse) {
                        //increment the `current` counter and recursively call this function again
                        current++;
                        var adjustedCount = formHandler.newLinkNumber - errorCount;
                        console.log('Links minus errors: ' + adjustedCount);
                        $('.linkNumber').text(adjustedCount);
                        $('.loader-running').css({
                          'width': (294 * percentage)
                        });
                        if (current == (ajaxes.length - 1)) {
                          $('.loader-running').css({
                            'width': 294
                          });
                        } else {
                          $('.loader-running').css({
                            'width': (294 * percentage)
                          });
                        }
                        do_ajax();
                      },
                      error: function(serverResponse) {
                        current++;
                        errorCount++;
                        $('.plural').hide();
                        $('.failed-uploads').show();
                        // $('.failed-uploads ul').append("<li>" + ajaxes[current]['snippet']['resourceId']['videoId'] + "</li>");
                        $('.failed-uploads .errorNumber').html('<strong>' + errorCount + '</strong>');
                        console.log(formHandler.newLinkNumber);
                        console.log('errors counted: ' + errorCount);
                        var adjustedCount = formHandler.newLinkNumber - errorCount;
                        console.log('Links minus errors: ' + adjustedCount);
                        $('.linkNumber').text(adjustedCount);
                        if (errorCount > 1) {
                          $('.plural').show();
                          $('.plural2').text(' are');
                          $('.plural3').text(' have');
                        }
                        console.log(serverResponse);
                        if (current == (ajaxes.length - 1)) {
                          $('.loader-running').css({
                            'width': 294
                          });
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
                        }
                        if (current < ajaxes.length) {
                          do_ajax();
                        }
                      }
                    }).done(function(data, textStatus, request) {
                      console.log("Song added, data: ", data, request);
                      console.log(formHandler.idArray);
                      console.log('current step: ' + current);
                      console.log('Ajaxes.length - 1: ' + (ajaxes.length - 1));
                      if (current >= (ajaxes.length - 1)) {
                        $('.loader-running').css({
                          'width': 294
                        });
                        $('.loader').removeClass('loader-running');
                        $('.loader-container').fadeOut();
                        finished = true;
                        $('.success-message').fadeIn('fast');
                        if (formHandler.existingPlaylist === false) {
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
                    url: "https://www.googleapis.com/youtube/v3/playlistItems?pageToken=" + formHandler.nextPageToken + "&part=snippet&maxResults=50&playlistId=" + formHandler.existingName + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4",
                    headers: {
                      Authorization: 'Bearer ' + accessToken
                    },
                    contentType: 'application/json',
                  }).done(function(data, textStatus, request) {
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
                        } else if (currentGet == data.items.length) {
                          console.log(duplicates.length);
                          for (var g = 0; g < (duplicates.length + 1); g++) {
                            found = jQuery.inArray(duplicates[g], formHandler.idArray);
                            console.log('iterator length = ' + g);
                            if (found >= 0) {
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
                                  for (var i = 0; i < formHandler.idArray.length; i++) {
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
                    error: function(serverResponse) {
                      $('.scanner-loader-container').fadeOut();
                      $('.invalidPlaylist').fadeIn();

                    }
                  }).done(function(data, textStatus, request) {
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
                        } else if (currentGet == data.items.length) {
                          console.log(duplicates.length);
                          for (var g = 0; g < duplicates.length; g++) {
                            found = jQuery.inArray(duplicates[g], formHandler.idArray);
                            console.log(g);
                            if (found >= 0) {
                              // Element was found, remove it.
                              formHandler.idArray.splice(found, 1);
                              duplicatesFound.push(duplicates[g]);
                              console.log('This was removed from idArray: ' + duplicates[g]);
                              console.log('Links remaining in idArray: ' + formHandler.idArray.length);
                              console.log('Remaining Array items: ' + formHandler.idArray);
                            }
                            if (g == (duplicates.length - 1)) {
                              $('.scanner-loader-container').fadeOut();
                              if (formHandler.idArray.length === 0) {
                                $('.duplicates-message .all-duplicates').show();
                              } else {
                                console.log('running do_ajax()');
                                (function ajaxArray() {
                                  for (var i = 0; i < formHandler.idArray.length; i++) {
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
                if (formHandler.existingPlaylist !== true) {
                  console.log('if wins');
                  formHandler.newLinkNumber = formHandler.idArray.length;
                  (function ajaxArray() {
                    for (var i = 0; i < formHandler.idArray.length; i++) {
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
                  } else {
                    formHandler.newLinkNumber = formHandler.idArray.length;
                    (function ajaxArray() {
                      for (var i = 0; i < formHandler.idArray.length; i++) {
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

  var gatherURL = {
    receivedData: {
      numberofLinks: null,
      existingPlaylist: null,
      newName: null,
      existingName: null,
      stillScrolling: null,
      scrolled: false,
      arrayCreated: null,
      accessToken: null,
      request: function request() {
        var port = chrome.runtime.connect({
          name: "popup.js"
        });
        port.onMessage.addListener(function(message, sender) {
          if (message.greeting == 'hello') {
            console.log(message.accessToken);
            formHandler.accessToken = message.accessToken;
          }
        });
      }
    },
    videoID: [],
    regexFunctions: {
      topScroller: function topScroller(scrollNumber) {
        if (gatherURL.scrolled === undefined) {
          console.log('running');
          $(document.body).scrollTop(0);
          gatherURL.scrolled = true;
        }
        gatherURL.stillScrolling = true;
        $("html, body").animate({
          scrollTop: $(document).height()
        }, 100);
        setTimeout(function() {
          if (gatherURL.videoID.length < scrollNumber) {
            console.log(gatherURL.videoID.length);
            console.log('running second');
            console.log($('#contentArea .uiList').length);
            console.log('Is browser still scrolling: ' + gatherURL.stillScrolling);
            if (gatherURL.stillScrolling === true) {
              gatherURL.regexFunctions.findLink();
              gatherURL.regexFunctions.topScroller(formHandler.numberofLinks);
            }
            $(window).scrollEnd(function() {
              console.log(gatherURL.stillScrolling);
              gatherURL.stillScrolling = false;
              var links = gatherURL.videoID.length;
              if (gatherURL.arrayCreated === undefined) {
                gatherURL.arrayCreated = true;
                chrome.storage.local.set({
                  'value': [gatherURL.videoID, links]
                }, function() {
                  // Notify that we saved.
                  console.log('Settings saved');
                });
              }
            }, 5000);
          } else if (gatherURL.videoID.length == scrollNumber) {
            console.log(gatherURL.videoID);
            var links = gatherURL.videoID.length;
            // Save it using the Chrome extension storage API.
            console.log(gatherURL.arrayCreated);
            if (gatherURL.arrayCreated === undefined) {
              gatherURL.arrayCreated = true;
              chrome.storage.local.set({
                'value': [gatherURL.videoID, links]
              }, function() {
                // Notify that we saved.
                console.log('Settings saved');
              });
            }
          }
        }, 1000);
      },
      extractVideoID: function extractVideoID(url) {
        var matches = url.match("(youtu\.be\\?\/|v=)([a-zA-Z0-9\_\-]+)&?");
        var regExp = '';
        for (var i in matches) {
          if (matches[i].match("^[a-zA-Z0-9\_\-]+$")) {
            regExp = matches[i];
            break;
          }
        }
        var videoID = regExp;
        return videoID;
      },

      anchorExtractor: function anchorExtractor(validator, regexItem, thisKeyword, iteration) {
				console.log('extractor initiated');
				console.log(validator);
        console.log('regex item: ' + regexItem);
        if (validator.toLowerCase().indexOf("youtube") >= 0) {
          console.log('validationPassed');
          $(thisKeyword).addClass('youtubeLink');
          if ($(thisKeyword).hasClass('youtubeLink')) {
            console.log('This is the number of youtube Links: ' + $('.youtubeLink').length);
            if ((gatherURL.videoID.length) < formHandler.numberofLinks || formHandler.threadCounter === true) {
              console.log(gatherURL.videoID.length);
              var found = jQuery.inArray(gatherURL.regexFunctions.extractVideoID(regexItem), gatherURL.videoID);
							console.log('found: ' + found);
              if (found >= 0) {
                // Element was found, remove it.
                console.log('Already exists in scan Array: ' + found);
              } else if (found < 0 || formHandler.threadCounter === true) {
                // Element was not found, add it.
                if (gatherURL.regexFunctions.extractVideoID(regexItem) !== "" || formHandler.threadCounter === true) {
                  console.log(gatherURL.regexFunctions.extractVideoID(regexItem));
                  gatherURL.videoID.push(gatherURL.regexFunctions.extractVideoID(regexItem));
                  if (formHandler.threadCounter === true) {
										console.log('iteration: ' + iteration);
										console.log(($('#contentCol #contentArea #pagelet_group_ .chosenThread').length - 1));
                    if (iteration == ($('#contentCol #contentArea #pagelet_group_ .chosenThread').length - 1)) {
											console.log('passed4');
                      var links = gatherURL.videoID.length;
                      gatherURL.arrayCreated = true;
                      console.log('success');
                      chrome.storage.local.set({
                        'value': [gatherURL.videoID, links]
                      }, function() {
                        // Notify that we saved.
                        console.log('Settings saved');
                      });
                    }
                  }
                }
              }
            }
          }
        }
      },

      findLink: function findLink() {
        console.log('Is this a threadcounter process: ' + formHandler.threadCounter);
        if (formHandler.threadCounter === true) {
          console.log('ThreadCounter running');
          console.log($('.chosenThread').length);
          $('#contentCol #contentArea #pagelet_group_ .chosenThread').each(function(i) {
            console.log('activating function inside of chosen thread');
						var youtubeLink = $(this).find('._6m3 .mbs').html();
						var checkYoutube = $(this).find('._6m3 ._59tj ._6lz').text();
						var iterator = i;
						console.log('running extractor first time');
						gatherURL.regexFunctions.anchorExtractor(checkYoutube, youtubeLink, this, iterator);
            $(this).find('.UFICommentContent').each(function() {
              var checkYoutube = $(this).find('._3-8y ._6m3 ._59tj ._6lz').text();
              var youtubeLink = $(this).find('._6m3 .mbs').html();
							console.log('running extractor second time');
              gatherURL.regexFunctions.anchorExtractor(checkYoutube, youtubeLink, this, iterator);
            });
          });
        } else {
          $('#contentCol #contentArea #pagelet_group_ .mbm .mtm').not(".marked").each(function(i) {
            $(this).addClass('marked');
            var youtubeLink = $(this).find('._6m3 .mbs').html();
            var checkYoutube = $(this).find('._6m3 ._59tj ._6lz').text();
            console.log('Total length equals: ' + i);
            gatherURL.regexFunctions.anchorExtractor(checkYoutube, youtubeLink, this);
          });
        }
      }
    },
  };
  gatherURL.receivedData.request();
  setTimeout(function() {
    createPopup.init();
    formHandler.init();
  }, 300);
})(jQuery);
