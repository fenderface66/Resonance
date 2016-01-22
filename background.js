var googleAuth = new OAuth2('google', {
  client_id: '167349066843-55nh95ts4k2g3fsfghoriv9a431phj6h',
  client_secret: 'eXytPWFfS23UUAkQz8m4WTyu',
  api_scope: 'https://www.googleapis.com/auth/tasks'
});

googleAuth.authorize(function() {
  // Ready for action
});

xhr.setRequestHeader('Authorization', 'OAuth ' + myAuth.getAccessToken());
