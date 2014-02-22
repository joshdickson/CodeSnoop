// views.js

var consoleView;
var commandView;
var stopped = false;
var isRunning = false;

var ConsoleView = Backbone.View.extend({

	// set the div for this element
	el: $("#console"),

	logtemplate: _.template($('#log-line').html()),

	errortemplate: _.template($('#error-line').html()),

	initialize: function() {
		var that = this;
		this._lineCounter = 1;
		

		(function(){
		    var oldLog = console.log;
		    console.log = function (message) {

		        var message = Array.prototype.slice.apply(arguments).join(' ')

		        that.render(new LoggerLine({ lineNumber: that._lineCounter, message: message}));
		        that._lineCounter++;
		    };
		})();

		(function(){
		    var oldLog = console.log;
		    console.error = function (message) {

		        var message = Array.prototype.slice.apply(arguments).join(' ');

		        that.renderError(new LoggerLine({ lineNumber: that._lineCounter, message: message}));
		        that._lineCounter++;
		    };
		})();

	},

	scrollBottom: function() {
		$('#console').scrollTop($('#console')[0].scrollHeight);
	},

	doFatalErrorResponse: function(message) {
		model = new LoggerLine({ lineNumber: this._lineCounter, message: ("Error: " + message)})
		this._lineCounter++;
		this.$el.append(this.errortemplate(model.toJSON()));
		$('#console').scrollTop($('#console')[0].scrollHeight);
		stopped = true;


		// sometimes this doesn't scroll to the bottom (execution is laggy a bit, so we'll re'scroll)
		setTimeout(this.scrollBottom(), 100);

	},

	reset: function() {
		$('#console').empty();
		this._lineCounter = 1;
	},

	render: function(model) {
		this.$el.append(this.logtemplate(model.toJSON()));

		socketSend('logEvent', model.toJSON());

		// scroll to the bottom of the div if necessary
		$('#console').scrollTop($('#console')[0].scrollHeight);
	},

	renderFromServer: function(model) {
		this.$el.append(this.logtemplate(model));
		// scroll to the bottom of the div if necessary
		$('#console').scrollTop($('#console')[0].scrollHeight);
	},

	renderError: function(model) {
		this.$el.append(this.errortemplate(model.toJSON()));

		socketSend('errorEvent', model.toJSON());

		$('#console').scrollTop($('#console')[0].scrollHeight);
	},


	renderErrorFromServer: function(model) {
		this.$el.append(this.errortemplate(model));

		$('#console').scrollTop($('#console')[0].scrollHeight);
	}
});


var CommandView = Backbone.View.extend({

	el: $("#commands"),

	events: {
    	"click #console-command-button":          "doCommand"
  	},

  	doCommand: function() {
  		

  		if(!isRunning) {
  			// do the code run
  			stopped = false;
  			isRunning = true;
  			consoleView.reset();
  			run();
  			
  		} else {
  			// stop the current code run, say we're not running
  			stopped = true;
  			isRunning = false;
  		}
  	}




});



// do view init routine
setTimeout(setViews, 1000);

function setViews() {
	consoleView = new ConsoleView();
	commandView = new CommandView();
}

