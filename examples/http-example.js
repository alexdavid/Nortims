// A simple example implementation of Nortims over HTTP

var NortimStreamer = require('../nortims.js'),
    http = require('http'),
    fs = require('fs');

var myStream = new NortimStreamer();
myStream.queueSong( fs.readFileSync("song.mp3") );
myStream.start();


http.createServer( function( request, response) {

  response.writeHead( 200, { "Content-Type": "audio/mp3" });
  myStream.on( 'data', function(data){
    response.write(data);
  });

}).listen(8080);
