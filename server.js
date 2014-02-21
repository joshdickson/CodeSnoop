// Including libraries

// globals
var aceContents = 'function printSomeThings() {\n\n' + 
    '\tvar random = Math.random();\n' + 
    
    
    '\tconsole.log("Did a run with random of: " + random);\n' + 
    '\tconsole.error("I can also print to stderr");\n' + 
    
    '\tsetTimeout(printSomeThings, 5000);\n\n' + 

'}\n\n' + 

'printSomeThings();\n\n'

var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    static = require('node-static'); // for serving files

var static = require('node-static')

var sock = 2002;

// This will make all the files in the current folder
// accessible from the web
// var fileServer = new static.Server('./client');

// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(sock);

// If the URL of the socket server is opened in a browser
function handler (request, response) {

    request.addListener('end', function () {
        fileServer.serve(request, response); // this will return the correct file
    });
}


var fileServer = new static.Server('./client');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(2000);

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

    // Start listening for mouse move events
    socket.on('aceUpdate', function (data) {

        // cache ace contents
        aceContents = data;

        // console.log("New ACE contents... " + aceContents);

        // send the update to the other listeners
        socket.broadcast.emit('serverAceUpdate', data);
    });

    // return the current ace contents 
    socket.on('refreshAce', function (data) {

        socket.emit('serverAceUpdate', aceContents);

    });
});