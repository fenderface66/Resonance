

var gatherURL = {
  videoID: [],
  IDGather: function() {

      console.log('function started');
      function extractVideoID(url){
        console.log('running');
        var regExp = url.match("v=([a-zA-Z0-9\_\-]+)&?")[1];
        var videoID = '/watch?v=' + regExp;
        return videoID;
      }
      $('#contentCol #contentArea #pagelet_group_ .mtm').each(function(i){
        $(this).find('._6m3 .mbs a').trigger('click');
        var youtubeLink = $(this).find('._6m3 .mbs').html();
        extractVideoID(youtubeLink);
        gatherURL.videoID.push(extractVideoID(youtubeLink));
        console.log(this);
        console.log(gatherURL.videoID);
      });


  }
};

gatherURL.IDGather();
