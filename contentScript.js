(function($) {
var gatherURL = {
  videoID: [],
  IDGather: function() {
      console.log('function started');
      function extractVideoID(url){
        var matches = url.match("(youtu\.be\\?\/|v=)([a-zA-Z0-9\_\-]+)&?");
        var regExp = '';
        for (var i in matches) {
          if (matches[i].match("^[a-zA-Z0-9\_\-]+$")) {
            regExp = matches[i];
            break;
          }
        }
        console.log(regExp);
        var videoID = regExp;
        return videoID;
      }
      setTimeout(function() {
        $('#contentCol #contentArea #pagelet_group_ .mtm').each(function(i){
          var youtubeLink = $(this).find('._6m3 .mbs').html();
          var checkYoutube = $(this).find('._6m3 ._59tj ._6lz').text();
          if (checkYoutube == 'youtube.com') {
            gatherURL.videoID.push(extractVideoID(youtubeLink));
            console.log(gatherURL.videoID);
          }
        });
      }, 6000);
  }
};
gatherURL.IDGather();
})(jQuery);
