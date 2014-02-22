// Including libraries

// globals

// the intial value that's at the server for the contents of ace to illustrate a loop
var aceContents = 'function printSomeThings() {\n\n' + 
    '\tvar random = Math.random();\n' + 
    
    
    '\tconsole.log("Did a run with random of: " + random);\n' + 
    '\tconsole.error("I can also print to stderr");\n' + 
    
    '\tsetTimeout(printSomeThings, 1000);\n\n' + 

'}\n\n' + 

'printSomeThings();\n\n';

var lastPushToGoogle = aceContents;

var loggedEvents = [];
var chatEvents = [];

var isRunning = false;
// do server set up


/**
 * Set up the file server on port 2000
 */
var static = require('node-static')

var fileServer = new static.Server('./client');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(2000);


/**
 * Set up socket.io on port 2002
 */

var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    static = require('node-static');

var sock = 2002;

app.listen(sock);

// set the handler for browser pick up
function handler (request, response) {

    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

    // Start listening for mouse move events
    socket.on('aceUpdate', function (data) {

        // cache ace contents
        aceContents = data;

        // send the update to the other listeners
        socket.broadcast.emit('serverAceUpdate', data);
    });

    // a client sent a log event
    socket.on('logEvent', function (data) {

        // log this as a log(i.e. not error) event
        loggedEvents.push('log', data)

        // send the update to the other listeners
        socket.broadcast.emit('logEvent', data);
    });

    // a client sent an error event
    socket.on('errorEvent', function (data) {

        // log this as a log(i.e. not error) event
        loggedEvents.push('error', data)

        // send the update to the other listeners
        socket.broadcast.emit('errorEvent', data);
    });

    // a client sent a new chat
    socket.on('chatEvent', function (data) {

        // cache the event
        chatEvents.push('chatEvent', data);

        // send the update to the other listeners
        socket.broadcast.emit('chatEvent', data);
    });

    // send console actions
    socket.on('console_action', function (data) {

        // send the update to the other listeners
        socket.broadcast.emit('console_action', data);
    });

    // return the current ace contents 
    socket.on('refreshAce', function (data) {

        socket.emit('serverAceUpdate', aceContents);

    });

    // return the running status or change the status
    socket.on('status_running', function (data) {


        socket.broadcast.emit('status_running', data);
        // if(data == "status"){
        //     socket.emit("server_status", '' + isRunning);
        // }else{
        //     isRunning = (data == "true");
        //     socket.broadcast.emit("server_status", '' + isRunning);
        // }
    });
});


function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}


//Drive Stuff
//Drive stuff
var GoogleTokenProvider = require("refresh-token").GoogleTokenProvider;

const CLIENT_ID = "805484943624-vps025nfja9lk7m3h2ntfd5qiunbuud9.apps.googleusercontent.com";
const CLIENT_SECRET = "wedUaVCLZCTfoNL8sVCFFLYl";
const REFRESH_TOKEN = "1/OdfrhBbds5j1u8vfR1l_h50cFLDdSrEMhHykH5KkicA";
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const FILE_ID = '1OY1cz15Dk3FI3gQcPsyh-3Jt5Py3aDHsQMlUbn4c3Z4';

const FILE_NAME = 'test.txt';

var async = require('async'),
    request = require('request'),
    fs = require('fs');


//Call me to update the google doc
function update_file(){
    async.waterfall([
      //-----------------------------
      // Obtain a new access token
      //-----------------------------
      function(callback) {
        var tokenProvider = new GoogleTokenProvider({
          'refresh_token': REFRESH_TOKEN,
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET
        });
        tokenProvider.getToken(callback)
      },

      function(accessToken, callback) {
        
         request.put({
              'url': 'https://www.googleapis.com/upload/drive/v2/files/' + FILE_ID,
              'qs': {
                 //request module adds "boundary" and "Content-Length" automatically.
                'uploadType': 'multipart'

              },
              'headers' : {
                'Authorization': 'Bearer ' + accessToken
              },
              'multipart':  [
                {
                  'Content-Type': 'application/json; charset=UTF-8',
                  'body': JSON.stringify({
                     'title': FILE_NAME
                   })
                },
                {
                  'Content-Type': 'text/plain',
                  'body': aceContents
                }
              ]
            }, callback);
           
      },

      //----------------------------
      // Parse the response
      //----------------------------
      function(response, body, callback) {
        var body = JSON.parse(body);
        callback(null, body);
      },

    ], function(err, results) {
      if (!err) {
        // console.log(results); suppress print call
      } else {
        console.error('---error');
        console.error(err);
      }
    });

}


function download_file(){
console.log("Downloading Google Doc")
    async.waterfall([
      //-----------------------------
      // Obtain a new access token
      //-----------------------------
      function(callback) {
        var tokenProvider = new GoogleTokenProvider({
          'refresh_token': REFRESH_TOKEN,
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET
        });
        tokenProvider.getToken(callback)
      },

      function(accessToken, callback) {
         request.get({
              'url': 'https://www.googleapis.com/drive/v2/files/' + FILE_ID,
              'headers' : {
                'Authorization': 'Bearer ' + accessToken
              }
              
            }, function(err, response, body) {
                if(!err && response.statusCode == 200){
                    var body = JSON.parse(body);
                    request.get({
                        'url': body.exportLinks["text/plain"],
                        'headers' : {
                            'Authorization': 'Bearer ' + accessToken
                        }
                  
                        }, callback);
                }
            });
           
      },

      //----------------------------
      // Parse the response
      //----------------------------
      function(response, body, callback) {
        callback(null, body);
      }

    ], function(err, results) {
      if (!err) {
        console.log("Finished Download. you may use your app")
         aceContents = results.substr(1);
         lastPushToGoogle = aceContents
      } else {
        console.error('---error');
        console.error(err);
      }
    });

}
 //download_file()


// continuously loop to update the file if it's changed
function pushToGoogleDoc() {
    if(lastPushToGoogle !== aceContents) {
        console.log(displayTime() + " Pushing file to Google...");
        update_file();
        lastPushToGoogle = aceContents;
        console.log(displayTime() + " finished pushing")
    }
    setTimeout(pushToGoogleDoc, 5000);
}

pushToGoogleDoc();



// End Drive Stuff