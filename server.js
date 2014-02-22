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

var loggedEvents = [];


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

    // return the current ace contents 
    socket.on('refreshAce', function (data) {

        socket.emit('serverAceUpdate', aceContents);

    });
});
