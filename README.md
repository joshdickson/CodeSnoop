##Codesnoop

2/22/14 Update: We were the winning project! Thanks for the votes.

#### About

Codesnoop is an entry for the 2014 Google and WPI hosted Hackathon. It's a gorgeous way to collaborate with your friends in real time, and we think just the beginning of real-time code collaboration on the web.

![](http://i.imgur.com/x94NgCs.jpg)
Simple log in.

![](http://i.imgur.com/n1DnwdN.png)
Easy collaboration.

#### Overview

Codesnoop is an online collaboration tool for writing great code with your contributors right in the browser.

Codesnoop bring together the functionality of tools that we use every day:

* Real time collaboration (Google Docs, Apple iWork)
* Cloud hosting (Google Drive, Dropbox)
* IDEs that provide easy run/stop/test settings and automate builds (Eclipse, Visual Studio)
* Real time chats (Google, Facebook, IRC, etc)
* Text editors (Sublime, Notepad++, Coda, etc)

... and brings it all right to the browser in real time.

CodeSnoop is built around a handfull of core features. Users log in with their first and last names, and an optional admin code. Some codesnoop features are restricted to admins, some are available to anybody watching.

The main dashboard includes a real-time collaborative editor. Admins can make changes at any time, and their modifications are relayed immediately to other collaborators. 

Codesnoop implements a command line directly into the browser. To do this, codesnoop is smart. We use Javascript injection to maintain access to code as it's being executed, which allows us to monitor it and check for errors. This means if you run code inside the Codesnoop command line that produces errors or exceptions, you'll easily be able to see what they are and where they are coming from.

We've also included the ability for admins to start and stop builds at any time. The build progress can be seen and modified by any other admins at any time.

Codesnoop also includes a chat client. Anybody viewing the room can chat, administrator or not. This allows real-time communication right where it's needed. Users can show or hide the chat box at any time by clicking the header bar.

The application is also directly synced to Google Docs and Google Drive. As you make changes to the document in the browser, they are smartly pushed to the server in real time.


#### Platform

Codesnoop is built on a host of open source platforms and integrated with Google for access to the Google Drive and Google Doc APIs. Codesnoop is built with HTML5/Javascript, primarily using:
* Node.js
* Socket.io
* jQuery
* Underscore.js
* Backbone.js


#### Running the Application

The server can be started locally by running:

```$ node server.js```

... from the main package at the command line. Navigate to http://localhost:2000/index.html to start a new application instance.


#### License

This software is released under the MIT license http://opensource.org/licenses/MIT.

#### Contact

Forward any feedback to the author(s). For contact information see package.json.



