var globalSetInProgress = false;


var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setReadOnly(true);


editor.getSession().on('change', function(e) {
	if(!globalSetInProgress) {
    	// send the new value to the server
        socketSend('aceUpdate', editor.getValue());
	}
	
});


function setAceContent(content) {

	// set the content and put the cursor back where it belongs...
	cursorLocation = editor.selection.getCursor();

	globalSetInProgress = true;

	editor.setValue(content, cursorLocation.row);
	editor.moveCursorToPosition(cursorLocation);

	globalSetInProgress = false;

}

// run the code in the editor after script injection...
function run() {
	try {

		var funct = editor.getValue();

		// here, we attempt to add an assert hook to a global 'run ended' var that is checked before doing setTimeout calls...
		funct = funct.split("{").join("{ if(stopped)return; try {");
		funct = funct.split("}").join("} catch(e) { consoleView.doFatalErrorResponse(e.stack) }}");

        // exec the modified function
		var temp = new Function(funct);
		temp();

	} catch(e) {
		consoleView.doFatalErrorResponse(e.stack);
	}
}

var userName;
        var isAdministrator;

        // do the listener to grab the user's name
        $(document).ready(function() {

            // fix the height of the console and editor windows;
            var heightFix = $(window).height() - 56;
            $('#console').css('height', (heightFix) + 'px');
            $('#editor').css('height', (heightFix - 42) + 'px');


            // initially hide the chat
            $('#text-log').css('height', '0');
            $('#text-entry').css('height', '0');
            $('#chat-message').hide();

            // debug sets
            // userName = "Josh Dickson";
            // isAdministrator = true;
            // var nameTokens = userName.split(" ");
            // $('#header-first').html(nameTokens[0]);
            // $('#header-last').html(nameTokens[1]);
            // editor.setReadOnly(false);

            $('#login').keypress(function (e) {
                // if pressing enter and they have a valid two word name
                if (e.which == 13 && $('input#username').val().split(" ").length == 2) {
                    
                    userName = $('input#username').val();
                    adminCode = $('input#adminCode').val();

                    if(adminCode === 'kodiak') {
                        isAdministrator = true;
                        editor.setReadOnly(false);
                    } else {
                        isAdministrator = false;
                        $('#verified-user').css('display', 'none');
                    }

                    // notify the others that someone new is here...
                    var nameTokens = userName.split(" ");

                    var nameTokens = userName.split(" ");
                    $('#header-first').html(nameTokens[0]);
                    $('#header-last').html(nameTokens[1]);

                    var model = new ChatMessage({firstName: nameTokens[0], lastName: nameTokens[1], chatMessage: (nameTokens[0] + ' has joined the chat...')});

                    socketSend('chatEvent', model);
              

                    $('#login-wrapper').remove();

                    return false;
                }
            });



            // set up the chat toggle to view / hide
            $('#chat-header').click(function() {
                // toggle the height of the chat elements to show/hide...
                var currentHeight = $('#text-log').css('height');

                if(currentHeight === '0px') {
                    $('#text-log').css('height', '500px');
                    $('#text-entry').css('height', '26px');
                    $('#chat-message').show();
                    $('input#chat-message').focus();
                } else {
                    $('#text-log').css('height', '0');
                    $('#text-entry').css('height', '0');
                    $('#chat-message').hide();
                }
            });

            $('#text-entry').keypress(function (e) {
                if (e.which == 13) {
                    message = $('input#chat-message').val();

                    if(message.length > 0) {

                        var nameTokens = userName.split(" ");

                        var model = new ChatMessage({firstName: nameTokens[0], lastName: nameTokens[1], chatMessage: message});

                        // log the message and emit to the server
                        chatView.newChatMessage(model);

                        $('input#chat-message').val("");

                    }
                    


                    return false;
                }
            });

        });