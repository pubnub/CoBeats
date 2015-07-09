$(document).ready(function() {
  var icon = $('.play');
  icon.click(function() {
     icon.toggleClass('active');
     return false;
  });
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// Instantiate Global Variables
var SoundArray = [];
var SongArray = [];
var SongMap = {};
var SongLen = 1000;
var kit     = 'A';
var record  = false;
var play    = false;
var startTime = 0;
var hours   = 0;
var mins    = 0;
var seconds = 0;
var millis  = 0;
var lib = "A";
var UUID = "";

function Playback() {
  if (play && record) {
	  recIt();
	  return;
  }
  else if (play) {
	  stopIt();
	  return;
  }
  else if (!record){
    startTime = Date.now();
  }
  play = true;

  function playItBack(idx){
    setTimeout(function(){
        var item = SongArray[idx];
        if (!play){
	        return;
        }
        if (idx >= SongArray.length) { 
	        var x = SongLen - (Date.now()-startTime);
	        setTimeout(function(){
		        if (!record) {
		        	startTime = Date.now();
					playItBack(0);
				}
	        }, x);
	        return; 
	    }
        while(Date.now() - startTime < item.time){
          playItBack(idx);
          return;
        }
        playSound(item.kit, item.key);
        playItBack(idx+1);
    }, 5);
  }
  playItBack(0);
}

// Button Click Functions
$('#record').click(function(){
	recIt();
});

function stopIt(){
	if (record || play){
        if (record){ // If record? If first record?
	      $("#record").css("color","#444");
          record = false;
          SoundArray.sort(compare);
          makeSongArray();
		  SongLen = SongArray.length ? SongArray[SongArray.length-1].time+250 : 1000;
          publishCoBeat('stop', SongLen);
          publishCoBeat('riff', SoundArray);
          saveToParse();
        }
      play = false;
      stopClock();
    }
	$('#mins').html('00:');
	$('#seconds').html('00.');
	$('#millis').html('00');	
}

function recIt(){
	if (modalOpen()) {
      return;
    }
    if (record || play){
	    $("#record").css("color","#444");
        stopIt();
        return;
    }
    else{
	  $("#record").css("color","red");
      hours   = 0;
      mins    = 0;
      seconds = 0;
      $('#mins').html('00:');
      $('#seconds').html('00.');
      $('#millis').html('00');
      record  = true;
      startTime = Date.now();
      Playback();
      startTimer();
    }
}

$('#stop').click(function(){
	stopIt();
});

$('#reset').click(function(){
	if (record || play) { return; }
	stopClock();
	record  = false;
	startTime = 0;
	hours   = 0;
	mins    = 0;
	seconds = 0;
	
	$('#mins').html('00:');
	$('#seconds').html('00:');
	$('#millis').html('00');
	
	SoundArray.length = 0;
	SongLen = 1000;
	makeSongArray();
	publishCoBeat('stop', SongLen);
	publishCoBeat('riff', SoundArray);
	saveToParse();
	clearCanvas();
});

function stopClock(){
	if (typeof timex !== "undefined"){
		clearTimeout(timex);
	}
}

function makeSongArray(){
	var song = [];
	for(var i=0; i<SoundArray.length; i++){
		song.push(SoundArray[i]);
	}
	for(var key in SongMap){
		var beats = SongMap[key];
		for (var i=0; i<beats.length; i++){
			song.push(beats[i]);
		}	
	}
	song.sort(compare);
	SongArray = song;
}

function compare(a,b) {
  if (a.time < b.time)
    return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}


// The Time Counter
function startTimer(){
  timex = setTimeout(function(){
    millis++;
    if(millis > 99){
      seconds++;
      millis=0;
      if(seconds >59){
        seconds=0;
        mins++;
        if(mins>59) {
          mins=0;
        }                   
        if(mins<10){                     
          $("#mins").text('0'+mins+':');
        }       
        else 
          $("#mins").text(mins+':');
      }    
      if(seconds <10) {
        $("#seconds").text('0'+seconds + ':');} 
      else {
        $("#seconds").text(seconds + ':');
      }
    }
    if(millis <10) {
      $("#millis").text('0'+millis);} 
    else {
      $("#millis").text(millis);
    }
    startTimer();
  },10);
}

var themes = {
  A: { background: "#222"},
  B: { background: "#BE90D4" },
  C: { background: "#6BB9F0" },
  D: { background: "#86E2D5" },
  E: { background: "#81CFE0" },
  F: { background: "#ECF0F1" },
  G: { background: "#6B8CFF" }
}; 

function swap(one, two) {
    document.getElementById(one).style.display = 'block';
    document.getElementById(two).style.display = 'none';
}

// Catch all keyboard presses
$(window).keydown(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).addClass('active');

  if(key >= 48 && key <=57){ //1-9
    switch(key - 48){
      // case 0:
      //   lib = "Z";
      //   break;  
      case 1:
        lib = "A";
        $("html").css("background-color",themes.A.background);
            swap("hex", "ring");
            swap("hex", "twist");
            swap("hex", "spin");
            swap("hex", "circ");
            swap("hex", "atom");
            swap("hex", "game");

        break;
      case 2:
        lib = "B";
        $("html").css("background-color",themes.B.background);
            swap("ring", "hex");
            swap("ring", "twist");
            swap("ring", "spin");
            swap("ring", "circ");
            swap("ring", "atom");
            swap("ring", "game");

        break;
      case 3:
        lib = "C";
        $("html").css("background-color",themes.C.background);
            swap("twist", "ring");
            swap("twist", "hex");
            swap("twist", "spin");
            swap("twist", "circ");
            swap("twist", "atom");
            swap("twist", "game");


        break;
      case 4:
        lib = "D";
        $("html").css("background-color",themes.D.background);
            swap("spin", "ring");
            swap("spin", "hex");
            swap("spin", "twist");
            swap("spin", "circ");
            swap("spin", "atom");
            swap("spin", "game");

        break;
      case 5:
        lib = "E";
        $("html").css("background-color",themes.E.background);
            swap("circ", "ring");
            swap("circ", "hex");
            swap("circ", "twist");
            swap("circ", "spin");
            swap("circ", "atom");
            swap("circ", "game");

        break;
      case 6:
        lib = "F";
        $("html").css("background-color",themes.F.background);
            swap("atom", "ring");
            swap("atom", "twist");
            swap("atom", "spin");
            swap("atom", "circ");
            swap("atom", "hex");
            swap("atom", "game");
 
        break;
      case 7:
      lib = "G";
      $("html").css("background-color",themes.G.background);
          swap("game", "ring");
          swap("game", "twist");
          swap("game", "spin");
          swap("game", "circ");
          swap("game", "hex");
          swap("game", "atom");

        break;
    }
  }
  else if(key >= 65 && key <= 90){ // Letter Press
      playSound(lib, e.keyCode);
      if (record){
        var elapsed = Date.now() - startTime;
        if (key in SOUNDS){
	    	var beat = {key:key, time:elapsed, kit:lib};
			SoundArray.push(beat);
			publishCoBeat('beat', beat);
        }
      }
      $(".active").css("color",getRandomColor);

  }
  else if (key == 16){ // Shift Bar
  	recIt();  
  }
  else if (key == 32) { // Space Bar
    if (modalOpen()) {
      return;
    }
    e.preventDefault(); 

    if (record || play){
    	stopIt();
    } 
    else
  	 Playback();
  }
  else //not a valid key press
    console.log("Invalid key");
});



$(window).keyup(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).removeClass('active');
  $('.key.k' + key).css("border-color", getRandomColor());

});

// Play sounds on button press
var SOUNDS = {
  'q':"/flash-1.mp3",
  'w':"/clay.mp3", 
  'e':"/moon.mp3", 
  'r':"/piston-1.mp3", 
  't':"/timer.mp3", 
  'y':"/suspension.mp3", 
  'u':"/prism-1.mp3", 
  'i':"/squiggle.mp3", 
  'o':"/glimmer.mp3", 
  'p':"/dotted-spiral.mp3" ,
  'a':"/flash-2.mp3",
  's':"/veil.mp3",
  'd': "/ufo.mp3",
  'f':"/piston-2.mp3",
  'g':"/bubbles.mp3",
  'h':"/strike.mp3",
  'j':"/prism-2.mp3"  ,
  'k':"/pinwheel.mp3",
  'l':"/zig-zag.mp3",
  'z':"/flash-3.mp3",
  'x':"/wipe.mp3",
  'c':"/splits.mp3" ,
  'v':"/piston-3.mp3",
  'b':"/corona.mp3",
  'n':"/confetti.mp3",
  'm':"/prism-3.mp3",
  ' ':""
 };

function playSound(kit, sound){
  //console.log(sound+  " was pressed");
  if (typeof(sound)=="number"){
    key = String.fromCharCode(sound).toLowerCase();
  } 
  else {
    key = sound;
  }
  new Audio(kit + SOUNDS[key]).play();
}

// Handle the canvas
var W = 800;
var H = 150;
var canvas = document.getElementById("canvas"),
       ctx = canvas.getContext("2d");

// Applying these to the canvas element
canvas.height = H; 
canvas.width  = W;

var playBar = {
	color:'#F64747',
	getX : function(){
		var elapsed = 0;
		if (record || play) {
			elapsed = (Date.now() - startTime);
			if (elapsed > SongLen) {
				SongLen = elapsed;
				elapsed -= 2;
			}
		}
		return elapsed/(SongLen*1.0) * canvas.width;
	},
	draw: function(){
		ctx.beginPath();
		ctx.moveTo(this.getX(),0);
		ctx.lineTo(this.getX(), canvas.height);
		ctx.lineWidth = 4;
		ctx.strokeStyle=this.color;
		ctx.stroke();
	}	
};

var mySong = {
	beats: 1,
	colors: ['rgba(47, 204, 112, {0})', 'rgba(68, 109, 179, {0})', 'rgba(31, 58, 148, {0})', 'rgba(250, 192, 59, {0})', 
			 'rgba(221, 198, 225, {0})','rgba(248, 147, 5, {0})', 'rgba(3, 166, 120, {0})', 'rgba(155, 88, 181, {0})', 
			 'rgba(220, 11, 91, {0})'],
	radius: 10,
	getX : function(beat){
		return beat.time/SongLen * canvas.width;
	},
	getY : function(pos){
		return canvas.height/(this.beats+1) * (pos+1);
	},
	getOpac : function(beat){
		var strt = 'a'.charCodeAt(0);
		var code = beat.key.charCodeAt(0);
		var oVal = (code-strt)/(26.0*1.75);
		return 1.00 - oVal;
	},
	playing: function(beat){
		return (playBar.getX() > this.getX(beat)-this.radius && playBar.getX() < this.getX(beat)+this.radius);
	},
	drawBeat: function(beat, pos) {
		var xVal = this.getX(beat);
		var yVal = this.getY(pos);
		var playing = this.playing(beat);
		var rad  = playing ? this.radius+4 : this.radius;
		var col  = playing ? '#F64747' : this.colors[pos%this.colors.length].format(this.getOpac(beat));
		ctx.beginPath();
		ctx.arc(xVal, yVal, rad, 0, Math.PI*2, false);
		ctx.fillStyle = col;
		ctx.fill();
		ctx.closePath();
	},
	draw: function(){
		this.beats = Object.keys(SongMap).length + 1;
		var song = [SoundArray];
		for (var uuid in SongMap){
			song.push(SongMap[uuid]);
		}
		for (var i=0; i < song.length; i++){
			for (var j=0; j < song[i].length; j++){
				this.drawBeat(song[i][j], i);
			}	
		}
	}
};

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}

function update() {
	clearCanvas();
	mySong.draw();
	playBar.draw();
}

setInterval(update, 1000/60);


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


///////////////////////////
// PubNub Collaborations //
///////////////////////////
var firstName = ["gifted", "grooving", "slow", "jiggy", "soulful", "swaggy", "punk", "rock", "jazzy", "DJ", "Chance The", "A$AP", "Big", "lil", "kid", "Mr"];
var lastName = ["kazoo", "triangle", "forte", "sax", "flute", "banjo", "oboe", "piano", "drums"];

UUID = makeName();
var chan = "coBeats" + Math.floor(Math.random()*100);
var userArray = [];

function makeName(){
  var first = firstName[Math.floor(Math.random()*firstName.length)];
  var last = lastName[Math.floor(Math.random()*lastName.length)];
  return first + "-" + last;
}

pubnub = PUBNUB({                          
    publish_key   : 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
    subscribe_key : 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    uuid: UUID,
    heartbeat: 30,
    heartbeat_interval: 10
});

function subscribeTo(chan){
  pubnub.subscribe({                                     
        channel : chan,
        message : function(m){
	        if (m.uuid != UUID){
				switch(m.type){
				case "beat":
					if (m.uuid in SongMap){
						SongMap[m.uuid].push(m.data);
						SongMap[m.uuid].sort(compare);
					} else {
						SongMap[m.uuid] = [m.data];
					}
					break;	
				case "riff":
					SongMap[m.uuid] = m.data;
					break;
				case "stop":
					if (SongLen < m.data){  // Publish SongLen, if different get everyone				
						SongLen = m.data;		 //  to use the longest song version.
					} else if (SongLen != m.data) {
						publishCoBeat('stop', SongLen);
					}	
					makeSongArray();
					break;
				case "trash":
					trash();
				}
	        }
        },
        connect: function(m){
          loadFromParse()
        },
        presence: function(m){
	      console.log(m);
          if (m.action == "join"){
            if (userArray.indexOf(m.uuid) == -1){
              userArray.push(m.uuid);
            }
          } else if (m.action == "leave" || m.action == "timeout"){
            var idx = userArray.indexOf(m.uuid);
            if (idx != -1){
              userArray.splice(idx, 1);
            }
          }
        writeUsers();
        }
    });
  document.getElementById("songName").innerHTML = chan;

}



function pubInit(){
  subscribeTo(chan);
}
pubInit();

function publishCoBeat(type, data){
	pubnub.publish({
	    channel: chan,        
	    message: {type:type, data:data, uuid:UUID},
	    callback : function(m){console.log(m)},
	});
}

////submitting info from the GO button
function submitInfo(){
  var song = document.getElementById("song-name").value;
  //console.log(song);
  pubnub.unsubscribe({channel:chan});
  chan = (song=="") ? chan : song;
  subscribeTo(chan);
  userArray.length  = 0;
}

function writeUsers(){
  var list = document.getElementById("userList");
  var html = "";
   if (userArray.indexOf(UUID) == -1) {
    userArray.push(UUID);
  }
  for (var i = 0; i < userArray.length; i++) {
    if (userArray[i] == UUID) {
      html += "<li style='color:#F5AB35' id='user'><i class='fa fa-user' style='color:#F5AB35' id='user'></i> " + userArray[i] + "</li>";
    }
    else{
      html += "<li>" + userArray[i] + "</li>";
    }
  }
  list.innerHTML = html;
}

/////////////////////
// Parse Functions //
/////////////////////

function doTrash(){
	trash();
	publishCoBeat('trash', "trash");
}

function trash(){
  SoundArray.length = 0;
  SongArray.length  = 0;
  for (prop in SongMap) { if (SongMap.hasOwnProperty(prop)) { delete SongMap[prop]; } }
  SongLen = 1000;
  record  = false;
  play    = false;
  startTime = 0;
  hours   = 0;
  mins    = 0;
  seconds = 0;
  millis  = 0;
  stopClock();
  
  var SoundObject = Parse.Object.extend("Sounds");
  var query = new Parse.Query(SoundObject);
  query.equalTo("songName", chan);
  query.find({
    success: function(song) {
      if (song.length) {
        for (var i=0; i<song.length; i++){
          song[i].destroy({});
        }
      }
    }
  });
}


function loadFromParse(){
  SoundArray.length = 0;
  for (prop in SongMap) { if (SongMap.hasOwnProperty(prop)) { delete SongMap[prop]; } }
  
  var SoundObject = Parse.Object.extend("Sounds");
  var query = new Parse.Query(SoundObject);
  query.equalTo("songName", chan);
  query.find({
    success: function(song) {
      if (song.length) {
        for (var i=0; i<song.length; i++){
          if (song[i].get('userName')==UUID){
            SoundArray = song[i].get('SoundAndTime');
          } else {
            SongMap[song[i].get('userName')] = song[i].get('SoundAndTime');
          }
        }
      }
      makeSongArray();
      SongLen = (SongArray.length > 0) ? SongArray[SongArray.length-1].time+250 : 1000;
    }
  });
}

function saveToParse() {
  if (record) return;

  var SoundObject = Parse.Object.extend("Sounds");
  // Assume Parse.Object myPost was previously created.
  var query = new Parse.Query(SoundObject);
    query.equalTo("songName", chan);
    query.equalTo("userName", UUID);
    query.first({
    success: function(song) {
      if (song) {
         song.save(null, {
            success: function (songSave) {
                songSave.set("SoundAndTime", SoundArray);
                songSave.save();
            }
        });
      }
      else{
        var soundObject = new SoundObject();
        soundObject.set("SoundAndTime", SoundArray);
        soundObject.set("userName", UUID);
        soundObject.set("songName", chan);
        soundObject.save();
      }
     
    }
  });
}

var globalModal = $('.global-modal');
    $( ".btn-green-flat-trigger" ).on( "click", function(e) {
      e.preventDefault();
      $( globalModal ).toggleClass('global-modal-show');
    });
    $( ".overlay" ).on( "click", function() {
      $( globalModal ).toggleClass('global-modal-show');
    });
    $( ".global-modal_close" ).on( "click", function() {
      $( globalModal ).toggleClass('global-modal-show');
    });
    $(".mobile-close").on("click", function(){
      $( globalModal ).toggleClass('global-modal-show');
    });


var globalModal2 = $('.global-modal2');
    $( ".btn-red-flat-trigger2" ).on( "click", function(e) {
      e.preventDefault();
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $( ".overlay" ).on( "click", function() {
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $( ".global-modal2_close" ).on( "click", function() {
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $(".mobile-close2").on("click", function(){
      $( globalModal2 ).toggleClass('global-modal2-show');
    });



function modalOpen(){
  return globalModal.hasClass('global-modal-show') || globalModal2.hasClass('global-modal2-show');
}


$(".mat-input").focus(function(){
  $(this).parent().addClass("is-active is-completed");
});

$(".mat-input").focusout(function(){
  if($(this).val() === "")
    $(this).parent().removeClass("is-completed");
  $(this).parent().removeClass("is-active");
})




console.clear();
var marioSteps = 1;
setInterval(function() {
  marioSteps++
  if (marioSteps > 2) {
    marioSteps = 0;
  }
  
  if (marioSteps == 1) {
    $('.mario').css('background-position', '0px')
  } else if (marioSteps == 2) {
    $('.mario').css('background-position', '68px')
    $('.mario').css('left', '-8px')
  } else {
    $('.mario').css('background-position', '120px');
    $('.mario').css('left', '4px')
  }
}, 80)

$('html, body').on('keydown', function(e) {
  if (e.keyCode == 32 || e.keyCode == 16) {
    $('.mario').addClass('mario_jump');
    setTimeout(function() {
      $('.mario').removeClass('mario_jump')
    }, 800)
  }
})
