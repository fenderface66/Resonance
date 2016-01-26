var formHandler = {
    numberofLinks: null,
    existingPlaylist: false,
    existingName: '',
    newName: '',
    idArray: '',
    validFBurl: function validFBurl(enteredURL) {
      var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
      if (!enteredURL.match(FBurl)) {
        $('.error-message').show();
      } else {
        $('.error-message').hide();
        chrome.tabs.executeScript(null, {
          file: "jquery-1.11.2.min.js"
        }, function() {
          chrome.tabs.executeScript(null, {
            file: "contentScript.js"
          });
        });
      }
    },
    ajaxCall: function ajaxCall() {

    },
    init: function init() {
        $('.existing').hide();
        $('.new').hide();
        $('input[type="radio"]').click(function() {
          if ($('.newPlaylist[value="yes"]').is(":checked")) {
            $('.existing').slideDown();
            $('.new').slideUp();
          } else {
            $('.existing').slideUp();
            $('.new').slideDown();
          }
        });
        $('#go').on('click', function() {
            formHandler.numberofLinks = $('option:selected').html();
            formHandler.numberofLinks = parseInt(formHandler.numberofLinks);
            if ($('.existingPlaylist[value="yes"]').is(":checked")) {
              formHandler.existingPlaylist = true;
            } else {
              formHandler.existingPlaylist = false;
            }
            formHandler.existingName = $('input[name="oldPlaylist"]').val();
            formHandler.newName = $('input[name="playlistName"]').val();
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, function(tab) {
              //Be aware that `tab` is an array of Tabs
              console.log(tab[0].url);
              formHandler.validFBurl(tab[0].url);
            });
            chrome.runtime.onConnect.addListener(function(port) {
              port.postMessage({
                numberofLinks: formHandler.numberofLinks,
                existingPlaylist: formHandler.existingPlaylist,
                newName: formHandler.newName,
                existingName: formHandler.existingName
              });
            });
            chrome.storage.onChanged.addListener(function(changes, namespace) {
              console.log("change received!");
            });
            setTimeout(function() {
              chrome.storage.local.get('value', function(obj) {
                console.log('value', obj);
                formHandler.idArray = obj.value;
                console.log(formHandler.idArray);
                google.authorize(function() {
                  (function() {

                    //setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
                    var ajaxes = [],
                      current = 0;

                    (function ajaxArray() {
                      for (var i = 0; i < formHandler.idArray.length; i++) {
                        var accessToken = google.getAccessToken();
                        var metadata = {
                          snippet: {
                            playlistId: "PLsZBx9eYlpVXSGzHjX8oaBiLD5GNjE2w3",
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
                      if (current < ajaxes.length) {
												console.log(ajaxes[current]);
                        var accessToken = google.getAccessToken();
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
                            do_ajax();
                          }
                        }).done(function (data, textStatus, request) {
														console.log("in success of ajax call, data: ", data, request);
												});
                      }
                    }
                    //run the AJAX function for the first time once `document.ready` fires
                    do_ajax();
									})();
                  });
                });

              }, 5000);
            });
          }
        };

				// 						var accessToken = google.getAccessToken();
				// 						var metadata = {
				// 							snippet: {
				// 								playlistId: "PLsZBx9eYlpVXSGzHjX8oaBiLD5GNjE2w3",
				// 								resourceId: {
				// 									kind: "youtube#video",
				// 									videoId: formHandler.idArray[0]
				// 								},
				// 							}
				// 						};
				// 						console.log(metadata);
				// 						$.ajax({
				// 							method: "POST",
				// 							url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
				// 							data: JSON.stringify(metadata),
				// 							headers: {
				// 								Authorization: 'Bearer ' + accessToken
				// 							},
				// 							contentType: 'application/json',
				// 						}).done(function (data, textStatus, request) {
				// 							console.log("in success of ajax call, data: ", data, request);
				// 						});
        var google = new OAuth2('google', {
          client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
          client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
          api_scope: 'https://www.googleapis.com/auth/youtube',
        });


        $(document).ready(function() {
          formHandler.init();
        });
