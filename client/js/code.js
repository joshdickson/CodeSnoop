var globalSetInProgress = false;


var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");


editor.getSession().on('change', function(e) {
	if(!globalSetInProgress) {
    	// send the new value to the server
        socketSend('aceUpdate', editor.getValue());
	}
	
});


function setAceContent(content) {

	// content = editor.getValue();

	// set the content and put the cursor back where it belongs...
	cursorLocation = editor.selection.getCursor();

	globalSetInProgress = true;

	editor.setValue(content, cursorLocation.row);
	editor.moveCursorToPosition(cursorLocation);

	globalSetInProgress = false;

	// console.log('Setting content...');

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

