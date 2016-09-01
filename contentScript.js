(function ($) {
  // extension:
  $.fn.scrollEnd = function (callback, timeout) {
    $(this).scroll(function () {
      var $this = $(this);
      if ($this.data('scrollTimeout')) {
        clearTimeout($this.data('scrollTimeout'));
      }
      $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
  };
  //Object for injecting Resonance popup onto Facebook page. 
  var createPopup = {
    fn: {
      insert: function insert() {
        $('#facebook').prepend('<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,600,400" rel="stylesheet" type="text/css"><div class="popupMinified"><a class="open">Open</a></div><div class="statsTab stat-info tab"><p>Top 100</p></div><div class="recentTab recent-info tab"><p>Recent 100</p></div><div class="popupMain"></div><div class="stats stat-info"><ol id="stat-list"></ol></div><div class="recent recent-info"><ol id="recent-list"></ol></div>');

        $('.popupMain').fadeIn().prepend('<div class="content-container"> <a class="close">Close</a><a class="minify">Minify</a> <div class="intro-screen"> <img src="chrome-extension://pahaeemkffdhpnhabiidgpjpggdiadpj/ajax-loader.gif"/> <div class="text-container"> <p>Resonance</p><p>Grab the best tracks from Facebook &amp; put them directly into your Youtube</p><a class="starter">Get Started</a> </div></div><div class="invalidToken"> <p>It looks like something went wrong with accessing Youtube, this sometimes happens, please refresh and try again</p></div><div class="notLinkThread"> <p>It looks like the thread(s) you selected contain(s) no youtube links</p></div><div class="scanner-loader-container"> <div class="text-container"> <h3>Now scanning page for links</h3> <p>If you&rsquo;ve selected 100 or above links this may take a minute or two</p><p>Please refrain from clicking on the page or changing tabs whilst this is happening</p></div><img class="scanner-loader" src="chrome-extension://pahaeemkffdhpnhabiidgpjpggdiadpj/ajax-loader.gif"/> </div><form class="playlistInfo"> <legend>Please Select Resonance Preferences</legend> <fieldset> <label>Would you like to put these songs into an existing playlist or a newly created one?</label> <input class="existingPlaylist" type="radio" name="existingPlaylist" value="yes"> Existing Playlist <br><input class="existingPlaylist" type="radio" name="existingPlaylist" value="no"> New Playlist <br><div class="existing"> <label for="oldPlaylist">What is the ID of this playlist?</label> <input name="oldPlaylist" type="text" / placeholder="Playlist ID"><span class="explain">?</span> <div class="explanation"> <p>You can find your playlist ID by going to the playlist page on youtube and extracting it from the url</p><p><span class="explain-header">Example</span> <br><br>https://www.youtube.com/playlist?list=<strong>PLLE1K_p2t-JKUfeaaPCXqu8idT3wsOv4C</strong></p><p>The part in bold is your playlist ID</p>If this playlist is private its name will not appear in the upload info. It will however still have the links uploaded to it</p></div></div><div class="new"> <label for="playlistName">Name of new playlist</label> <input name="playlistName" type="text" / placeholder="Music Playlist"> </div><label>Would you like to extract links by number, thread or from the Resonance top 100?</label> <input class="numThread" type="radio" name="numThread" value="yes"> Number <br><input class="numThread" type="radio" name="numThread" value="no"> Thread <br><input class="numThread" type="radio" name="numThread" value="topSongs"> Resonance 100 <br><div class="linkNumberContainer"> <label for="linkNumber">How many links would you like to add</label> <select name="linkNumber"> <option>5</option> <option>10</option> <option>20</option> <option>30</option> <option>40</option> <option>50</option> <option>60</option> <option>70</option> <option>80</option> <option>90</option> <option>100</option> <option>200</option> </select> </div><div class="threadCollecter"> <p>Please click on the posts you would like to extract links from. When you are finished click done</p><p>Number of threads: <span class="threadNumber">Click done to see how many threads you have selected.</span></p><div class="doneButton">Done</div></div><div class="topSongs"> <p>This will take either the top 100 or the most recent 100 tracks that users have extracted using Resonance and place them into a playlist for you. You can see what these songs are be clicking on the "Top 100" or "Recent 100" tab on the top left of this window.</p><input class="resonanceTracks" type="radio" name="topRes" value="Top"> Top 100 <br><input class="resonanceTracks" type="radio" name="topRes" value="Recent"> Recent 100 <br></div><div id="go">Get Your Music</div></fieldset> </form><div class="finish-screen"> <div class="upload-title"> <h2>Uploading Links to Youtube</h2> </div><div class="loader-container"> <div class="loader loader-running"></div></div><div class="scanInfo"> <h3>Info</h3> <p><strong>Playlist Name: </strong><span class="playlistName"></span> <p> <p><strong>Links to be added: </strong><span class="linkNumber"></span> <p> </div><div class="failed-uploads"> <p><span class="errorNumber"></span> video<span class="plural">s</span><span class="plural2"> is</span> invalid and <span class="plural3">has</span> not been uploaded</p></div><p class="error-message">Oops, please make sure you are on a facebook group page before clicking GO</p><div class="duplicates-message"> <p class="all-duplicates">It appears that all the links you tried to add already exist in this playlist <p> <p class="duplicatesAndErrors">It appears that all the links you tried to add either already exist in this playlist or were invalid links</p><p class="numDuplicates"><span class="duplicates-number"></span> duplicate<span class="plural5">s </span>have been found</p></div><p class="invalidPlaylist">The playlist id you gave seems to be invalid please make sure you have entered it correctly. Refresh and try again</p><div class="success-message"> <p>Congratulations! Your playlist is now ready for you</p><a target="_blank" href="">Go to Playlist</a> </div></div></div>');
      },

      insertStats: function insertStats(obj, stats) {
        var list;
        if (stats === true) {
          list = "#stat-list"
        } else {
          list = "#recent-list"
        }
        for (var i = 0; i < obj.length; i++) {

          $(list).append("<li><a target='_blank' href='https://www.youtube.com/watch?v=" + obj[i]["itemID"] + "'><img src='" + obj[i]["youData"][0]["snippet"]["thumbnails"]["medium"]["url"] + "'/>" + obj[i]["youData"][0]["snippet"]["title"] + "</a></li>")
        }

      },
    },
    init: function (obj) {
      createPopup.fn.insert();
      formHandler.init();
      //Reload page if user wants to try again (This needs to be replaced)
      $('.success-message a').click(function () {
        location.reload();
      });
    }
  };
  //Object for handling form user inputs and preferences
  var formHandler = {
    numberofLinks: null,
    existingPlaylist: false,
    existingName: '',
    newName: '',
    idArray: [],
    originalList: '',
    newPlaylistID: '',
    receivedLinks: '',
    existingLinks: [],
    idLength: '',
    nextPageToken: '',
    ajaxGetInitialised: false,
    newLinkNumber: null,
    threadCounter: false,
    changesCompleted: false,
    threadStart: false,
    threadFinish: false,
    pageCount: 0,
    pages: 0,
    //Check if thread has opened up 
    intervalCheck: function intervalCheck(handle, elem) {
      handle.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      elem.dispatchEvent(handle);
      formHandler.pageCount += 1;
    },
    //Allows user to chose threads for extraction by clicking on them. 
    postLister: function postLister() {
      $('.numThread[value="no"]').click(function () {
        formHandler.threadStart = true;
      });
      $('.mbm').click(function () {
        if (formHandler.threadFinish === false && formHandler.threadStart === true) {
          $(this).toggleClass('chosenThread');
        }
      });

      $(document).on('DOMNodeInserted', function (e) {
        if ($(e.target).is('.mbm')) {
          $(e.target).click(function () {
            if (formHandler.threadFinish === false && formHandler.threadStart === true) {
              $(this).toggleClass('chosenThread');
            }
          });
        }
      });
      //On done click open up threads of chosen posts
      $('.doneButton').click(function () {
        formHandler.threadFinish = true;
        $('.threadNumber').text($('.chosenThread').length);
        $('.chosenThread').each(function () {
          if ($(this).find('.UFIPagerLink').length || $(this).find('._3399').length) {
            if ($(this).find('.UFIPagerLink').length === 0) {
              var first = $(this).find('._524d ._ipm');
              var e = document.createEvent("MouseEvents");
              e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              first[0].dispatchEvent(e);
              $(this).find('._524d a').click(function () {
                event.preventDefault();
              });
              $(this).find('._ipo ._ipm').trigger('click');
              $(this).find('.UFIContainer .UFIPagerLink').trigger('click');
              console.log($(this));
              var newChosen = $(this);

              console.log($(this).find('.UFIPagerLink'));

              console.log('success');
              var one = $(this).find('.UFIPagerLink span');
              var two = $(this).find('.UFIPagerLink');
              var three = $(this).find('.UFIRow');
              var e = document.createEvent("MouseEvents");
              var interval = null;
              var thisKeyword = this
              e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);


              console.log('if passed');
              setTimeout(function () {
                var children = $(thisKeyword).find('.UFIContainer').children();
                children = $(children).children();
                children = $(children).children();
                children = children[0];
                children = $(children).find('.UFIPagerLink');
                console.log($(thisKeyword).find('.UFIPagerLink').length);
                two = children;
                two[0].dispatchEvent(e);
                $(this).find('.UFIPagerLink span').trigger('click');
                $(this).find('.UFIPagerLink').trigger('click');
                $(this).find('._4oep').trigger('click');
                $('.threadCollecter').append('<h2 class="threadWarning">Opening Thread, please wait</h2>');
                $('#go').fadeOut();
                interval = setInterval(function () {
                  formHandler.intervalCheck(e, two[0]);
                  if (formHandler.pageCount > 6) {
                    console.log(formHandler.pageCount);
                    clearInterval(interval);

                    $('.threadWarning').text("Thread opened, you may now get your music");

                    $('.doneButton').fadeOut();
                    $('#go').fadeIn();
                  }
                }, 1000);
              }, 1000)
            } else {
              $(this).find('._524d a').click(function () {
                event.preventDefault();
              });
              $(this).find('._ipo ._ipm').trigger('click');
              $(this).find('.UFIContainer .UFIPagerLink').trigger('click');
              console.log($(this));
              var newChosen = $(this);

              console.log($(this).find('.UFIPagerLink'));

              console.log('success');
              var one = $(this).find('.UFIPagerLink span');
              var two = $(this).find('.UFIPagerLink');
              var three = $(this).find('.UFIRow');
              var e = document.createEvent("MouseEvents");
              var interval = null;
              var thisKeyword = this
              e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              console.log('else');
              two[0].dispatchEvent(e);
              $(this).find('.UFIPagerLink span').trigger('click');
              $(this).find('.UFIPagerLink').trigger('click');
              $(this).find('._4oep').trigger('click');
              $('.threadCollecter').append('<h2 class="threadWarning">Opening Thread, please wait</h2>');
              $('#go').fadeOut();
              interval = setInterval(function () {
                formHandler.intervalCheck(e, two[0]);
                if (formHandler.pageCount > 6) {
                  console.log(formHandler.pageCount);
                  clearInterval(interval);
                  $('.threadWarning').text("Thread opened, you may now get your music");
                  $('.doneButton').fadeOut();
                  $('#go').fadeIn();
                }
              }, 1000);
            }
          }
        });
      });
    },
    //Close popup on close click
    popupClose: function () {
      $('.close').click(function () {
        formHandler.threadStart = false;
        formHandler.threadFinish = false;
        $('.popupMain').remove();
        $('.chosenThread').removeClass('chosenThread');
        location.reload();
      });
    },
    //Minify popup on minify click
    popupMinify: function () {
      $('.minify').click(function () {
        $('.popupMain').slideUp('fast');
        $('.popupMinified').show();
        $('.stats').hide();
        $('.statsTab').hide();
        $('.recent').hide();
        $('.recentTab').hide();
      });
      $('.open').click(function () {
        $('.popupMain').slideDown('fast');
        $('.popupMinified').hide();
        $('.stats').show();
        $('.statsTab').show();
        $('.recent').show();
        $('.recentTab').show();
      });
    },
    //Run start up screen/animation
    popupStart: function () {
      setTimeout(function () {
        $('.intro-screen > img').addClass('closed');
        $('.intro-screen .text-container').addClass('open');
      }, 750);
      console.log("clicked");

      $('.starter').click(function () {

        $('.intro-screen').addClass('closed');
        setTimeout(function () {
          $('.intro-screen').addClass('hidden');
          $('.popupMain').addClass('opened');
          $('.playlistInfo').addClass('opened');
        }, 400);
      });
    },

    //Make POST request to google that creates playlist on users account. 
    createPlaylist: function createPlaylist(accessToken) {
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
    },
    //Creates array of objects containing video data to be passed into POST request
    ajaxArray: function ajaxArray(arr, existing) {
      console.log(formHandler.existingName);
      var metadata;
      if (existing === true) {
        for (var i = 0; i < formHandler.idArray.length; i++) {
          metadata = {
            snippet: {
              playlistId: formHandler.existingName,
              resourceId: {
                kind: "youtube#video",
                videoId: formHandler.idArray[i]
              },
            }
          };
          arr.push(metadata);
          console.log(formHandler.idArray[i]);
        }
      } else {
        for (var j = 0; j < formHandler.idArray.length; j++) {
          metadata = {
            snippet: {
              playlistId: formHandler.newPlaylistID,
              resourceId: {
                kind: "youtube#video",
                videoId: formHandler.idArray[j]
              },
            }
          };
          arr.push(metadata);
          console.log(formHandler.idArray[j]);
        }
      }
    },
    //Initializer
    init: function init() {
      formHandler.postLister();
      formHandler.popupClose();
      formHandler.popupMinify();
      formHandler.popupStart();

      console.log('running formHandler');
      $('.existing').hide();
      $('.new').hide();
      $('.linkNumberContainer').hide();
      $('.threadCollecter').hide();
      $('.topSongs').hide();
      $('.existingPlaylist').click(function () {
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
      $('.numThread').click(function () {
        if ($('.numThread[value="yes"]').is(":checked")) {
          console.log('if');
          $('.linkNumberContainer').slideDown();
          $('.threadCollecter').slideUp();
          $('.topSongs').slideUp();
        } else if ($('.numThread[value="no"]').is(":checked")) {
          console.log('else');
          $('.threadCollecter').slideDown();
          $('.linkNumberContainer').slideUp();
          $('.topSongs').slideUp();
        } else {
          $('.linkNumberContainer').slideUp();
          $('.threadCollecter').slideUp();
          $('.topSongs').slideDown();
        }
      });


      $('.tab').click(function () {
        if (!$(".tab").hasClass('open')) {
          $(".tab").addClass('open');
        }

        if ($(this).hasClass("stat-info")) {
          $('.recent').removeClass('open');
          $('.stats').toggleClass('open');

        } else if ($(this).hasClass("recent-info")) {
          $('.stats').removeClass('open');
          $('.recent').toggleClass('open');

        }

        if ($('.recent').hasClass('open') || $('.stats').hasClass('open')) {
          console.log("happening");
          $(this).addClass('open');
        } else {
          $('.tab').removeClass('open');
          $('.recent').removeClass('open');
          $('.stats').removeClass('open');
        }

      })

      //Opens playlist ID explanation
      $('.explain').click(function () {
        console.log('explain clicked');
        $('.popupMain .explanation').slideToggle();
      });
      //On "get music" click begin extraction process.
      $('#go').on('click', function () {
        $('.scanner-loader-container').addClass('opened');
        $('.playlistInfo').addClass('closed');
        setTimeout(function () {
          $('.playlistInfo').addClass('hidden');
        }, 400)
        chrome.storage.local.clear(function () {
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

        } else if ($('.numThread[value="topSongs"]').is(":checked")) {
          formHandler.resonanceTracks = true;
          formHandler.threadCounter = undefined;
        }
        if (formHandler.accessToken === undefined) {
          $('.popupMain > div').hide();
          $('.invalidToken').show();
        }
        var accessToken = formHandler.accessToken;
        formHandler.createPlaylist(accessToken);
        if (formHandler.threadCounter === false) {
          console.log("running number scroller");
          gatherURL.regexFunctions.topScroller(formHandler.numberofLinks);
        } else if (formHandler.threadCounter === true) {
          console.log('running thread counter find link() function');
          setTimeout(function () {
            gatherURL.regexFunctions.findLink();
          }, 2000);
        } else if (formHandler.threadCounter === undefined) {
          var arr; 
          var idArr = [];
          if ($('.resonanceTracks[value="Top"]').is(":checked")) {

            arr = formHandler.top100;
            console.log(arr);
            for (var i = 0; i < arr.stats.length; i++) {
              formHandler.idArray.push(arr.stats[i].itemID)
            }

          } else if ($('.resonanceTracks[value="Recent"]').is(":checked")) {

            arr = formHandler.recent100;
            console.log(arr);
            for (var i = 0; i < arr.recent.length; i++) {
              formHandler.idArray.push(arr.recent[i].itemID)
            }
          }


          console.log(arr);



          console.log(idArr);
        }
        //Listen for changes to the playlist 
        chrome.storage.onChanged.addListener(function (changes, namespace) {
          formHandler.changesCompleted = true;
          console.log("change received!");
          setTimeout(function () {
            if (formHandler.existingPlaylist === false) {
              $('.playlistName').text(formHandler.newName);
            } else {
              $.get("https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=" + formHandler.existingName + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4", function (data) {
                console.log(data);
                $('.playlistName').text(data.items[0].snippet.title);
                console.log(data.items[0].snippet.title);
              });
              if ($('.playlistName').text() === '') {
                $('.playlistName').text('Set playlist to public to see playlist name');
              }
            }
            //Get stored data
            chrome.storage.local.get('value', function (obj) {
              if (formHandler.threadCounter !== undefined) {
                console.log('These are the received ids: ' + formHandler.originalList);
                console.log('Number of ids received: ' + formHandler.idLength);
                formHandler.idArray = obj.value[0];
                formHandler.idLength = formHandler.idArray.length;
                formHandler.originalList = formHandler.idArray.slice(0);
                formHandler.receivedLinks = obj.value[1];
              }

              if (formHandler.receivedLinks < formHandler.numberofLinks && formHandler.threadCounter === false) {
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
                finished = false;
                //declare function to run AJAX requests
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
                    console.log('Acces Token: ' + accessToken);
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
                        console.log('This has been a success');
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
                      error: function (serverResponse) {
                        current++;
                        errorCount++;
                        $('.plural').hide();
                        $('.failed-uploads').show();
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
                    }).done(function (data, textStatus, request) {
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
                //Allows get process to check the next page of an existing playlist for duplicate links. 
                function do_ajaxGetNextPage() {
                  console.log('ajaxGet Next page has been initialised');
                  console.log(formHandler.nextPageToken);
                  //check to make sure there are more requests to make
                  //make the AJAX request with the given data from the `ajaxes` array of objects
                  $.ajax({
                    method: "GET",
                    url: "https://www.googleapis.com/youtube/v3/playlistItems?pageToken=" + formHandler.nextPageToken + "&part=snippet&maxResults=50&playlistId=" + formHandler.existingName + "&key=AIzaSyBHRUtsTAr8xvNdUdXYkydgKxo6yGWkgq4",
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
                        //                                                console.log('These are the existing ids used for cross checking: ' + duplicates);
                        console.log('This is the length of the cross checking array:' + duplicates.length);



                        console.log('data items length: ' + data.items.length);
                        console.log('Current Get length: ' + currentGet);
                        if (data.items.length == 50 && currentGet == data.items.length && data.nextPageToken !== undefined) {
                          console.log('End of page reached');

                          console.log("This is the number of pages: " + formHandler.pages)

                          formHandler.nextPageToken = data.nextPageToken;
                          console.log('nextPage Token = ' + data.nextPageToken);
                          formHandler.pages = 1;


                          currentGet = 0;

                          console.log(pages);
                          do_ajaxGetNextPage();

                        } else if (currentGet == data.items.length && data.nextPageToken === undefined) {
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
                                formHandler.ajaxArray(ajaxes, true);
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
                //Checks for duplicates if user is extracting to an existing playlist. 
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
                    if (data.items.length >= 1) {
                      var found = '';
                      console.log('Existing playlist ids ' + data.items[0].snippet.resourceId.videoId);

                      for (var i = 0; i < data.items.length; i++) {
                        currentGet++;
                        console.log(data);
                        console.log(data.items[i].snippet.resourceId.videoId);
                        duplicates.push(data.items[i].snippet.resourceId.videoId);
                        console.log('Pushing the following exsting ids into a duplicates array for cross checking: ' + duplicates);
                        if (currentGet == data.items.length && currentGet == 50) {
                          console.log(data);
                          if (data.nextPageToken === undefined) {
                            formHandler.nextPageToken = data.prevPageToken;
                            formHandler.reversed = true;
                            console.log('prevPage Token = ' + data.prevPageToken);

                          } else if (formHandler.reversed !== true) {
                            formHandler.nextPageToken = data.nextPageToken;
                            console.log('nextPage Token = ' + data.nextPageToken);
                          }
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
                                formHandler.ajaxArray(ajaxes, true);
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
                  formHandler.ajaxArray(ajaxes, false);
                  do_ajax();
                } else {
                  console.log('else wins');
                  if (formHandler.ajaxGetInitialised === false) {
                    do_ajaxGet();
                    formHandler.ajaxGetInitialised = true;
                    console.log('formHandler.ajaxGetInitialised = ' + formHandler.ajaxGetInitialised);
                  } else {
                    formHandler.newLinkNumber = formHandler.idArray.length;
                    formHandler.ajaxArray(ajaxes, false);
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
  //Object for extracting links from Facebook Posts/HTML
  var gatherURL = {
    receivedData: {
      numberofLinks: null,
      existingPlaylist: null,
      newName: null,
      existingName: null,
      stillScrolling: null,
      scrolled: false,
      arrayCreated: false,
      accessToken: null,
      extractorIteration: 0,
      invalidThread: 0,
      successThread: 0,
      threadCount: 0,
      secondRun: false,
      dataStored: false,
      pageTitle: $("#headerArea h1 a").text(),
      request: function request() {
        var port = chrome.runtime.connect({
          name: "popup.js"
        });
        port.onMessage.addListener(function (message, sender) {
          if (message.greeting == 'hello') {
            console.log(message.accessToken);
            formHandler.accessToken = message.accessToken;
            return true;
          }
        });

      }
    },
    //Contains videoIDs for sending back to formHandler
    videoID: [],
    regexFunctions: {
      //Sends IDs to formhandler
      chromeStorage: function chromeStorage(idArray, linkLength, pageName) {
        setTimeout(function () {
          console.log('These items will be sent: ' + idArray);
          chrome.storage.local.set({
            'value': [idArray, linkLength, pageName]
          }, function () {
            // Notify that we saved.
            console.log('Settings saved');
            console.log('These items will be sent: ' + idArray);
          });
        }, 100);
      },
      //Scrolls down the page until the correct number of links have been extracted. 
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
        setTimeout(function () {
          if (gatherURL.videoID.length < scrollNumber) {
            console.log(gatherURL.videoID.length);
            console.log('running second');
            console.log('Is browser still scrolling: ' + gatherURL.stillScrolling);
            if (gatherURL.stillScrolling === true) {
              gatherURL.regexFunctions.findLink();
              gatherURL.regexFunctions.topScroller(formHandler.numberofLinks);
            }
            $(window).scrollEnd(function () {
              console.log(gatherURL.stillScrolling);
              gatherURL.stillScrolling = false;
              var links = gatherURL.videoID.length;
              if (gatherURL.arrayCreated === undefined) {
                gatherURL.receivedData.rrayCreated = true;
                gatherURL.regexFunctions.chromeStorage(gatherURL.videoID, links, gatherURL.receivedData.pageTitle);
              }
            }, 5000);
          } else if (gatherURL.videoID.length == scrollNumber) {
            console.log(gatherURL.videoID);
            var links = gatherURL.videoID.length;
            // Save it using the Chrome extension storage API.
            console.log(gatherURL.arrayCreated);
            if (gatherURL.receivedData.arrayCreated === undefined) {
              gatherURL.receivedData.rrayCreated = true;
              gatherURL.regexFunctions.chromeStorage(gatherURL.videoID, links, gatherURL.receivedData.pageTitle);
            }
          }
        }, 1000);
      },
      //Performs regex on url and extracts the videoID from it. 
      extractVideoID: function extractVideoID(url) {
        var matches = url.toString().match("(youtu\.be\\\\?\/|v=)([a-zA-Z0-9\_\-]+)&?");
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
      //Extracts URL from post html
      anchorExtractor: function anchorExtractor(validator, regexItem, thisKeyword, iteration, linkCount) {
        console.log('extractor initiated');
        console.log(validator);
        if (validator === '') {
          console.log('if1 passed');
          gatherURL.receivedData.invalidThread += 1;
          console.log(gatherURL.receivedData.invalidThread);
          if (gatherURL.receivedData.invalidThread > 1) {
            console.log('errorCount: ' + gatherURL.receivedData.invalidThread);
            console.log('iteration: ' + iteration);
            console.log('if2 passed');
          }
        } else {
          gatherURL.receivedData.successThread += 1;
        }
        console.log('errorCount: ' + gatherURL.receivedData.invalidThread);
        console.log('successCount: ' + gatherURL.receivedData.successThread);
        console.log('threadCount/iteration: ' + gatherURL.receivedData.threadCount);
        console.log('regex item: ' + regexItem);
        console.log('linkCount: ' + linkCount);
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
                console.log('This is the extracted ID: ' + gatherURL.regexFunctions.extractVideoID(regexItem));
                if (gatherURL.regexFunctions.extractVideoID(regexItem) !== "") {
                  console.log(gatherURL.regexFunctions.extractVideoID(regexItem));
                  gatherURL.videoID.push(gatherURL.regexFunctions.extractVideoID(regexItem));


                  console.log(gatherURL.videoID);
                  if (formHandler.threadCounter === true) {
                    console.log('This is the iteration we are on: ' + iteration);
                    console.log('This is the length of threads selected: ' + ($('#contentCol #contentArea #pagelet_group_ .chosenThread').length - 1));
                    if (iteration == ($('#contentCol #contentArea .chosenThread').length - 1)) {
                      var links = gatherURL.videoID.length;
                      console.log('success');
                      if (gatherURL.receivedData.secondRun === true && gatherURL.receivedData.invalidThread > 0 && gatherURL.receivedData.successThread === 0) {
                        $('.scanner-loader-container').hide();
                        $('.notLinkThread').show();
                      }
                      console.log('arrayCreated: ' + gatherURL.receivedData.arrayCreated);
                      if (gatherURL.receivedData.arrayCreated === false) {
                        gatherURL.receivedData.arrayCreated = true;
                        console.log(gatherURL.videoID);
                        gatherURL.regexFunctions.chromeStorage(gatherURL.videoID, links, gatherURL.receivedData.pageTitle);
                      }
                    }
                  }
                } else {
                  console.log('This is the failed extraction: ' + gatherURL.regexFunctions.extractVideoID(regexItem));
                }
              }
            }
          }
        } else {
          console.log('linkCount: ' + linkCount);
        }
      },
      //Finds the links within each post 
      findLink: function findLink() {
        console.log('Is this a threadcounter process: ' + formHandler.threadCounter);
        if (formHandler.threadCounter === true) {
          console.log('threadCount: ' + gatherURL.receivedData.threadCount);
          console.log('ThreadCounter running');
          console.log($('.chosenThread').length);
          $('#contentCol #contentArea .chosenThread').each(function (i) {
            console.log('activating function inside of chosen thread');
            var youtubeLink = $(this).find('._6m3 .mbs').html();
            var checkYoutube = $(this).find('._6m3 ._59tj ._6lz').text();
            var iterator = gatherURL.receivedData.threadCount;
            var linkCount;
            gatherURL.receivedData.threadCount += 1;
            if (i === 0) {
              gatherURL.receivedData.extractorIteration += (i + 1);
            } else {
              gatherURL.receivedData.extractorIteration += i;
            }
            linkCount = gatherURL.receivedData.extractorIteration;
            console.log(iterator);
            console.log('running extractor first time');
            gatherURL.regexFunctions.anchorExtractor(checkYoutube, youtubeLink, this, iterator, linkCount);
            $(this).find('.UFICommentContent').each(function (j) {
              var checkYoutube = $(this).find('._3-8y ._6m3 ._59tj ._6lz').text();
              var youtubeLink = $(this).find('._6m3 .mbs').html();
              if (j === 0) {
                gatherURL.receivedData.extractorIteration += (j + 1);
              } else {
                gatherURL.receivedData.extractorIteration += j;
              }

              linkCount = gatherURL.receivedData.extractorIteration;
              gatherURL.receivedData.secondRun = true;
              console.log(iterator);
              console.log('running extractor second time');
              gatherURL.regexFunctions.anchorExtractor(checkYoutube, youtubeLink, this, iterator, linkCount);
            });
          });
        } else {
          $('#contentCol #contentArea #pagelet_group_ .mbm .mtm').not(".marked").each(function (i) {
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

  //Initiates formhandler
  var initiator = {
    initiated: false,
    init: function init() {
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        console.log('Changed');
        chrome.storage.local.get('stats', function (obj) {
          console.log(obj);
          formHandler.top100 = obj;
          if (initiator.initiated === false) {
            if (!jQuery.isEmptyObject(obj)) {
              $(".stats").show();
              $(".statsTab").show();
              createPopup.fn.insertStats(obj.stats, true)
              initiator.initiated = true;
            }
          }

        });
        chrome.storage.local.get('recent', function (obj) {
          console.log(obj);
          if (initiator.recent === undefined) {
            if (!jQuery.isEmptyObject(obj)) {
              formHandler.recent100 = obj;
              $(".recent").show();
              $(".recentTab").show();
              createPopup.fn.insertStats(obj.recent)
              initiator.recent = true;
              console.log(obj);
            }
          }
        });
      });
      gatherURL.receivedData.request();
      var requestInterval;
      requestInterval = setInterval(function () {
        if (formHandler.accessToken !== undefined) {
          console.log(formHandler.accessToken);
          createPopup.init();
          $(".stats").hide();
          $(".statsTab").hide();
          $(".recent").hide();
          $(".recentTab").hide();
          clearInterval(requestInterval);
        }
      }, 80);
    }
  };
  //Initiate Resonance
  initiator.init();
})(jQuery);
