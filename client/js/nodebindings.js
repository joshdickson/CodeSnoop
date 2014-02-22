// connect to the server
socket = io.connect('http://localhost:2002');

// chirp a message to the node server
function socketSend(key, message) {
	socket.emit(key, message);
}

// on an ace update, we have to update the ACE view...
socket.on('serverAceUpdate', function (data) {
		setAceContent(data)
	});

	// update a log event received from the server
socket.on('logEvent', function (data) {
	consoleView.renderFromServer(data);
	});

// update an error event received from the server
	socket.on('errorEvent', function (data) {
	consoleView.renderErrorFromServer(data);
	});

	// update a user event from the server
	socket.on('console_action', function (data) {
	commandView.serverConsoleEvent(data);
	});

	// on status update, update our variables
	socket.on('status_running', function(data){

		stopped = !(data == "true");
		isRunning = (data == "true");

		// console.log(data);

		if(data === 'true') {
			// clear the console because someone else is building and we want to clear!
			consoleView.reset();
			consoleView.showStop();
		} else {
			consoleView.showRun();
		}
		
	});

	// update a chat event
	socket.on('chatEvent', function(data){
		chatView.newServerChatMessage(data);
	});

	// ask for the ace message right away
	socketSend('refreshAce', 'refresh');
	// socketSend('status_running','status');