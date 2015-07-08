Collaboration apps enable multiple users to interact with one another in realtime. Applications like Google Docs, GitHub collaboration, and Balsamiq have made it easy for any number of connected users to share updates, receive data simultaneously, and sync the state of the application.

In this blog post, we'll show you how to build a collaboration app. Our demo application is a simple music recording app with realtime collaboration capabilities. Multiple users can create songs together, and each keystroke is reflected in realtime across all browsers.

Want to see it in action? Checkout the [realtime music collaboration app demo here](http://pubnub.github.io/CoBeats/), and get playing with a couple friends. Additionally, check out the entire project repository, including all the code, here.

This tutorial will focus on adding PubNub to make a music app collaborative; however, many of the practices we use here can be used to customize your own collaborative app use case, like a multi-user text editor or collaborative design app.

Project Overview

To make this music collaboration app, we'll use the following APIs:

  * Javascript PubNub SDK to simplify the realtime collaboration.
  * Parse to store songs for later playback.
  * WebAudio API for controlling audio clips
  
When the record button is pressed, the info is stored locally into an array and published via PubNub. Subscribers to a channel will see the keypresses (messages), and those messages will be added to the song in realtime, as they're pressed. When finished recording, the entire array of keystrokes is saved to Parse, and songs and be retrieved and played back.

