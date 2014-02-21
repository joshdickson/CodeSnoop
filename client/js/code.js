		var globalSetInProgress = false;


		// hack console.log to grab output so we can render it...

		// (function(){
		//     var oldLog = console.log;
		//     console.warn = function (message) {

		//         var message = Array.prototype.slice.apply(arguments).join(' ')

		//         // our call is now really going to be 'message'!

		//         oldLog.call(console, "WARN: " +  message);


		//     };
		// })();

		





    	var editor = ace.edit("editor");
    	editor.setTheme("ace/theme/monokai");
    	editor.getSession().setMode("ace/mode/javascript");


    	editor.getSession().on('change', function(e) {
    		if(!globalSetInProgress) {
    			loc = editor.selection.getCursor();
		    	// console.log('Saw on change event, cursor now at row: ' + loc.row + ' and column: ' + loc.column);

		    	// we can percolate changes here...

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

    	function doRun() {
    		try {

    			var funct = editor.getValue();

    			// here, we attempt to add an assert hook to a global 'run ended' var that is checked before doing setTimeout calls...
    			funct = funct.split("{").join("{ if(stopped)return; try {");
    			funct = funct.split("}").join("} catch(e) { consoleView.doFatalErrorResponse(e.stack) }}");

    			// console.log(funct);




    			var temp = new Function(funct);
    			temp();
    		} catch(e) {
    			// append an identifier string so that we know this was an error (for now)
    			// console.log("WFwFP96nBjlNaR38Whgs" + e.message)
    			// var caller_line = (new Error).stack.split("\n")[4];
    			// console.log("Seeing: " + caller_line);
    			consoleView.doFatalErrorResponse(e.stack);
    		}
    	}

