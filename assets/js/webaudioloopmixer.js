/*
 * Name: Web Audio Loop Mixer
 * Description: Four Channel Loop Mixer with Effects. Audio Source via User Media.
 * Author: Obadiah Metivier
 * Author URI: http://middleearmedia.com/webaudioloopmixer/
 * Version: 2.2.1
 */

// This makes the knobs work (along with jquery.knob.js)
(function( $ ) {
	var methods = {
		init: function() {
		}, 
	};	
	$.fn.knob = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}    			
	};	
})( jQuery );
			
var context = new (window.AudioContext || window.webkitAudioContext)(); // Create audio container with webkit fallback
var source1 = null; // Create empty audio source 1
var source2 = null; // Create empty audio source 2
var audioBuffer2 = null; // Create empty audio buffer 2
var audioBuffer3 = null; // Create empty audio buffer 3
var audioBuffer4 = null; // Create empty audio buffer 4

// Convolver - Reverb - load the impulse response asynchronously
var impulse; // Create the Impulse Sound 
var getImpulse = new XMLHttpRequest(); // Load the Impulse Sound with XMLHttpRequest
getImpulse.open("GET", "assets/sounds/l960big_bathroom.wav", true); // Path to Audio File
getImpulse.responseType = "arraybuffer"; // Read as Binary Data
getImpulse.onload = function() {
	context.decodeAudioData(getImpulse.response, function(buffer){
		impulse = buffer; // Decode the Audio Data and Store it in a Variable
	});
}
getImpulse.send(); // Send the Request and Load the impulse File

// Allow user to select source file for channel 1
function initSound1(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer1 = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}
// Read user selected file as ArrayBuffer and pass it to the API
var fileInput1 = document.querySelector('#inputSource1');
fileInput1.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound1(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

// Allow user to select source file for channel 2
function initSound2(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer2 = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;	
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}
// Read user selected file as ArrayBuffer and pass it to the API
var fileInput2 = document.querySelector('#inputSource2');
fileInput2.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound2(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

// Allow user to select source file for channel 3
function initSound3(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer3 = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;	
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}
// Read user selected file as ArrayBuffer and pass it to the API
var fileInput3 = document.querySelector('#inputSource3');
fileInput3.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound3(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

// Allow user to select source file for channel 4
function initSound4(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer4 = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;	
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}
// Read user selected file as ArrayBuffer and pass it to the API
var fileInput4 = document.querySelector('#inputSource4');
fileInput4.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound4(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

function playSound() {
	source1 = context.createBufferSource(); // Create a sound source 1
	source1.buffer = audioBuffer1; // Add the buffered data to our object
	source1.loop = true; // Make it loop
	source1.connect(gain_1);
	source1.start(0); // Play immediately

	source2 = context.createBufferSource(); // Create a sound source 2 if it exists
	source2.buffer = audioBuffer2; // Add the buffered data to our object
	source2.loop = true; // Make it loop
	source2.connect(gain_2);
	source2.start(0); // Play immediately

	source3 = context.createBufferSource(); // Create a sound source 3 if it exists
	source3.buffer = audioBuffer3; // Add the buffered data to our object
	source3.loop = true; // Make it loop
	source3.connect(gain_3);
	source3.start(0); // Play immediately
 
	source4 = context.createBufferSource(); // Create a sound source 4 if it exists
	source4.buffer = audioBuffer4; // Add the buffered data to our object
	source4.loop = true; // Make it loop
	source4.connect(gain_4);
	source4.start(0); // Play immediately
	
	reverb = context.createBufferSource(); // Create an reverb sound source
	reverb.buffer = impulse; // Attatch our Audio impulse Data as it's Buffer
	reverb.normalize = true; // Perform a scaled RMS-power analysis of the audio data in buffer to calculate a normalizationScale
	// reverb.loop = true; // Make it loop. is this needed ???
	reverb.start(0); // Play the Impulse Sound Immediately

	// Duplicate these functions so settings are remembered if stop button is pressed	
	$(function () {
		document.getElementById('delayTime').addEventListener('change', function() {
			delay.delayTime.value = this.value;
		});
	})
	$(function () {
		document.getElementById('delayFeedback').addEventListener('change', function() {
			delayFeedback.gain.value = this.value;
		});
	})
	$(function () {
		document.getElementById('delayFilter').addEventListener('change', function() {
			delayFilter.frequency.value = this.value;
		});
	})
	$(function () {
		document.getElementById('delayLevel').addEventListener('change', function() {
			send2.gain.value = this.value;
		});
	})
//	$(function () {
//		document.getElementById('distortionLevel').addEventListener('change', function() {
//			send2.gain.value = this.value;
//		});
//	})

}
function stopSound() {
    delayFeedback.gain.value = 0;
    delayFilter.frequency.value = 0;
	
  if (source1) {
    source1.stop(0); // Stop source 1 immediately
  }
  if (source2) {
    source2.stop(0); // Stop source 2 immediately
  }
  if (source3) {
    source3.stop(0); // Stop source 3 immediately
  } 
  if (source4) {
    source4.stop(0); // Stop source 4 immediately
  }   
}

// Create Audio Nodes
var gain_1 = context.createGain(); // Create source gain node for channel 1
var gain_2 = context.createGain(); // Create source gain node for channel 2
var gain_3 = context.createGain(); // Create source gain node for channel 3
var gain_4 = context.createGain(); // Create source gain node for channel 4

var pan_1 = context.createPanner(); // Create panner node for channel 1
var pan_2 = context.createPanner(); // Create panner node for channel 2
var pan_3 = context.createPanner(); // Create panner node for channel 3
var pan_4 = context.createPanner(); // Create panner node for channel 4

var vol_1 = context.createGain(); // Create volume gain node for channel 1
var vol_2 = context.createGain(); // Create volume gain node for channel 2
var vol_3 = context.createGain(); // Create volume gain node for channel 3
var vol_4 = context.createGain(); // Create volume gain node for channel 4

var mute_1 = context.createGain(); // Create mute routing gain node channel 1
var mute_2 = context.createGain(); // Create mute routing gain node channel 2
var mute_3 = context.createGain(); // Create mute routing gain node channel 3
var mute_4 = context.createGain(); // Create mute routing gain node channel 4

var send1_1 = context.createGain(); // Create routing gain node for send 1 for channel 1
var send2_1 = context.createGain(); // Create routing gain node for send 2 for channel 1
var send3_1 = context.createGain(); // Create routing gain node for send 3 for channel 1
var sendmain_1 = context.createGain(); // Create routing gain node for main bus for channel 1

var send1_2 = context.createGain(); // Create routing gain node for send 1 for channel 2
var send2_2 = context.createGain(); // Create routing gain node for send 2 for channel 2
var send3_2 = context.createGain(); // Create routing gain node for send 3 for channel 2
var sendmain_2 = context.createGain(); // Create routing gain node for main bus for channel 2

var send1_3 = context.createGain(); // Create routing gain node for send 1 for channel 3
var send2_3 = context.createGain(); // Create routing gain node for send 2 for channel 3
var send3_3 = context.createGain(); // Create routing gain node for send 3 for channel 3
var sendmain_3 = context.createGain(); // Create routing gain node for main bus for channel 3

var send1_4 = context.createGain(); // Create routing gain node for send 1 for channel 4
var send2_4 = context.createGain(); // Create routing gain node for send 2 for channel 4
var send3_4 = context.createGain(); // Create routing gain node for send 3 for channel 4
var sendmain_4 = context.createGain(); // Create routing gain node for main bus for channel 4

// Distortion
var distortion = context.createWaveShaper(); // Create waveshaper node for distortion fx
function makeDistortionCurve( amount ) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

distortion.curve = makeDistortionCurve(400);
distortion.oversample = '4x';
	
// Reverb
var reverb = context.createConvolver(); // Create convolver node for reverb fx

// Delay
var delay = context.createDelay(); // Create delay node for delay fx

	delay.delayTime.value = 0.5;

    delayFeedback = context.createGain();
    delayFeedback.gain.value = 0.8;
 
    delayFilter = context.createBiquadFilter();
    delayFilter.frequency.value = 1000;

    delay.connect(delayFeedback);
    delayFeedback.connect(delayFilter);
    delayFilter.connect(delay);
	
 $(function () {
	document.getElementById('delayTime').addEventListener('change', function() {
		delay.delayTime.value = this.value;
	});
})
$(function () {
	document.getElementById('delayFeedback').addEventListener('change', function() {
		delayFeedback.gain.value = this.value;
	});
})
$(function () {
	document.getElementById('delayFilter').addEventListener('change', function() {
		delayFilter.frequency.value = this.value;
	});
})	
	
var send1 = context.createGain(); // Create routing gain node for send 1 (reverb)

var send2 = context.createGain(); // Create routing gain node for send 2 (delay)
send2.gain.value = 1;
$(function () {
	document.getElementById('delayLevel').addEventListener('change', function() {
		send2.gain.value = this.value;
	});
})

var send3 = context.createGain(); // Create routing gain node for send 3 (distortion)
send3.gain.value = 0.3;
// $(function () {
// 	document.getElementById('distortionLevel').addEventListener('change', function() {
// 		send3.gain.value = this.value;
// 	});
// })

var comp_global = context.createDynamicsCompressor(); // Create global compressor node
var gain_master = context.createGain(); // Create master gain node

// EQ settings
var makeHigh_1 = function () {
	var high1 = context.createBiquadFilter();
 	high1.type = "highshelf"; // Highshelf filter
	high1.frequency.value = 6000;
	high1.gain.value = $('#high-1').val();
	return high1;
}
var makeMid_1 = function () {
	var mid1 = context.createBiquadFilter();
	mid1.type = "peaking"; // Peaking filter
	mid1.frequency.value = 1000;
	mid1.Q.value = 1;
	mid1.gain.value = $('#mid-1').val();
	return mid1;
}
var makeLow_1 = function () {
	var low1 = context.createBiquadFilter();
	low1.type = "lowshelf"; // Lowshelf filter
	low1.frequency.value = 440;
	low1.gain.value = $('#low-1').val();
	return low1;
}
var makeHigh_2 = function () {
	var high2 = context.createBiquadFilter();
 	high2.type = "highshelf"; // Highshelf filter
	high2.frequency.value = 6000;
	high2.gain.value = $('#high-2').val();
	return high2;
}
var makeMid_2 = function () {
	var mid2 = context.createBiquadFilter();
	mid2.type = "peaking"; // Peaking filter
	mid2.frequency.value = 1000;
	mid2.Q.value = 1;
	mid2.gain.value = $('#mid-2').val();
	return mid2;
}
var makeLow_2 = function () {
	var low2 = context.createBiquadFilter();
	low2.type = "lowshelf"; // Lowshelf filter
	low2.frequency.value = 440;
	low2.gain.value = $('#low-2').val();
	return low2;
}
var makeHigh_3 = function () {
	var high3 = context.createBiquadFilter();
 	high3.type = "highshelf"; // Highshelf filter
	high3.frequency.value = 6000;
	high3.gain.value = $('#high-3').val();
	return high3;
}
var makeMid_3 = function () {
	var mid3 = context.createBiquadFilter();
	mid3.type = "peaking"; // Peaking filter
	mid3.frequency.value = 1000;
	mid3.Q.value = 1;
	mid3.gain.value = $('#mid-3').val();
	return mid3;
}
var makeLow_3 = function () {
	var low3 = context.createBiquadFilter();
	low3.type = "lowshelf"; // Lowshelf filter
	low3.frequency.value = 440;
	low3.gain.value = $('#low-3').val();
	return low3;
}

var makeHigh_4 = function () {
	var high4 = context.createBiquadFilter();
 	high4.type = "highshelf"; // Highshelf filter
	high4.frequency.value = 6000;
	high4.gain.value = $('#high-4').val();
	return high4;
}
var makeMid_4 = function () {
	var mid4 = context.createBiquadFilter();
	mid4.type = "peaking"; // Peaking filter
	mid4.frequency.value = 1000;
	mid4.Q.value = 1;
	mid4.gain.value = $('#mid-4').val();
	return mid4;
}
var makeLow_4 = function () {
	var low4 = context.createBiquadFilter();
	low4.type = "lowshelf"; // Lowshelf filter
	low4.frequency.value = 440;
	low4.gain.value = $('#low-4').val();
	return low4;
}

// High EQ
high_1 = makeHigh_1(),
high_2 = makeHigh_2(),
high_3 = makeHigh_3(),
high_4 = makeHigh_4(),
// Mid EQ
mid_1 = makeMid_1(),
mid_2 = makeMid_2(),
mid_3 = makeMid_3(),
mid_4 = makeMid_4(),
// Low EQ
low_1 = makeLow_1(),
low_2 = makeLow_2(),
low_3 = makeLow_3(),
low_4 = makeLow_4(),

// Volume
vol_1.gain.value = 1; // Initial volume is 100% for channel 1
vol_2.gain.value = 1; // Initial volume is 100% for channel 2
vol_3.gain.value = 1; // Initial volume is 100% for channel 3
vol_4.gain.value = 1; // Initial volume is 100% for channel 4

$(function () {
	document.getElementById('volume-1').addEventListener('change', function() {
		vol_1.gain.value = this.value;
	});
})
$(function () {
	document.getElementById('volume-2').addEventListener('change', function() {
		vol_2.gain.value = this.value;
	});
})
$(function () {
	document.getElementById('volume-3').addEventListener('change', function() {
		vol_3.gain.value = this.value;
	});
})
$(function () {
	document.getElementById('volume-4').addEventListener('change', function() {
		vol_4.gain.value = this.value;
	});
})

// Mute
mute_1.gain.value = 0; // Muted Volume is 0% for channel 1
mute_2.gain.value = 0; // Muted Volume is 0% for channel 2
mute_3.gain.value = 0; // Muted Volume is 0% for channel 3
mute_4.gain.value = 0; // Muted Volume is 0% for channel 4

// Listen for Knob changes
$(function () {
	$('#gain-1').dial({'change': function (v) {
		gain_1.gain.value = v / 10;
	}});
	$('#gain-2').dial({'change': function (v) {
		gain_2.gain.value = v / 10;
	}});
	$('#gain-3').dial({'change': function (v) {
		gain_3.gain.value = v / 10;
	}});
	$('#gain-4').dial({'change': function (v) {
		gain_4.gain.value = v / 10;
	}});	

	$('#high-1').dial({'change': function (v) {
		high_1.gain.value = v;
	}});
	$('#high-2').dial({'change': function (v) {
		high_2.gain.value = v;
	}});
	$('#high-3').dial({'change': function (v) {
		high_3.gain.value = v;
	}});
	$('#high-4').dial({'change': function (v) {
		high_4.gain.value = v;
	}});
	
	$('#mid-1').dial({'change': function (v) {
		mid_1.gain.value = v;
	}});
	$('#mid-2').dial({'change': function (v) {
		mid_2.gain.value = v;
	}});
	$('#mid-3').dial({'change': function (v) {
		mid_3.gain.value = v;
	}});
	$('#mid-4').dial({'change': function (v) {
		mid_4.gain.value = v;
	}});
	
    $('#low-1').dial({'change': function (v) {
		low_1.gain.value = v;
    }});
    $('#low-2').dial({'change': function (v) {
		low_2.gain.value = v;
    }});
    $('#low-3').dial({'change': function (v) {
		low_3.gain.value = v;
    }});
    $('#low-4').dial({'change': function (v) {
		low_4.gain.value = v;
    }});
	
    $('#pan-1').dial({'change': function (x) {
		var xDeg = x;
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		pan_1.setPosition(x, 0, z);
    }});
    $('#pan-2').dial({'change': function (x) {
		var xDeg = x;
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		pan_2.setPosition(x, 0, z);
    }});
    $('#pan-3').dial({'change': function (x) {
		var xDeg = x;
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		pan_3.setPosition(x, 0, z);
    }});
    $('#pan-4').dial({'change': function (x) {
		var xDeg = x;
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		pan_4.setPosition(x, 0, z);
    }});	

	$('#reverb-1').dial({'change': function (v) {
		send1_1.gain.value = v / 10;
	}});
	$('#reverb-2').dial({'change': function (v) {
		send1_2.gain.value = v / 10;
	}});
	$('#reverb-3').dial({'change': function (v) {
		send1_3.gain.value = v / 10;
	}});
	$('#reverb-4').dial({'change': function (v) {
		send1_4.gain.value = v / 10;
	}});

	// Send2 (Delay) Initial Channel gains
	send2_1.gain.value = 0; // 0% for channel 1
	send2_2.gain.value = 0; // 0% for channel 2
	send2_3.gain.value = 0; // 0% for channel 3
	send2_4.gain.value = 0; // 0% for channel 4

	$('#delay-1').dial({'change': function (v) {
		send2_1.gain.value = v / 10;
	}});
	$('#delay-2').dial({'change': function (v) {
		send2_2.gain.value = v / 10;
	}});
	$('#delay-3').dial({'change': function (v) {
		send2_3.gain.value = v / 10;
	}});
	$('#delay-4').dial({'change': function (v) {
		send2_4.gain.value = v / 10;
	}});

	// Send3 (Distortion) Initial Channel gains
	send3_1.gain.value = 0; // 0% for channel 1
	send3_2.gain.value = 0; // 0% for channel 2
	send3_3.gain.value = 0; // 0% for channel 3
	send3_4.gain.value = 0; // 0% for channel 4

	$('#distortion-1').dial({'change': function (v) {
		send3_1.gain.value = v / 10;
	}});
	$('#distortion-2').dial({'change': function (v) {
		send3_2.gain.value = v / 10;
	}});
	$('#distortion-3').dial({'change': function (v) {
		send3_3.gain.value = v / 10;
	}});
	$('#distortion-4').dial({'change': function (v) {
		send3_4.gain.value = v / 10;
	}});	
})
 
// Wiring

// Channel One Main Bus
gain_1.connect(pan_1);
pan_1.connect(vol_1);
vol_1.connect(sendmain_1);
sendmain_1.connect(comp_global);
// Channel One Reverb Send
vol_1.connect(send1_1);
send1_1.connect(reverb);
// Channel One Delay Send
vol_1.connect(send2_1);
send2_1.connect(delay);
// Channel One Distortion Send
vol_1.connect(send3_1);
send3_1.connect(distortion);

// Channel Two Main Bus
gain_2.connect(pan_2);
pan_2.connect(vol_2);
vol_2.connect(sendmain_2);
sendmain_2.connect(comp_global);
// Channel Two Reverb Send
vol_2.connect(send1_2);
send1_2.connect(reverb);
// Channel Two Delay Send
vol_2.connect(send2_2);
send2_2.connect(delay);
// Channel Two Distortion Send
vol_2.connect(send3_2);
send3_2.connect(distortion);

// Channel Three Main Bus
gain_3.connect(pan_3);
pan_3.connect(vol_3);
vol_3.connect(sendmain_3);
sendmain_3.connect(comp_global);
// Channel Three Reverb Send
vol_3.connect(send1_3);
send1_3.connect(reverb);
// Channel Three Delay Send
vol_3.connect(send2_3);
send2_3.connect(delay);
// Channel Three Distortion Send
vol_3.connect(send3_3);
send3_3.connect(distortion);

// Channel Four Main Bus
gain_4.connect(pan_4);
pan_4.connect(vol_4);
vol_4.connect(sendmain_4);
sendmain_4.connect(comp_global);
// Channel Four Reverb Send
vol_4.connect(send1_4);
send1_4.connect(reverb);
// Channel Four Delay Send
vol_4.connect(send2_4);
send2_4.connect(delay);
// Channel One Distortion Send
vol_4.connect(send3_4);
send3_4.connect(distortion);

// Effects Sends
reverb.connect(send1);
send1.connect(comp_global);	
delay.connect(send2);
send2.connect(comp_global);
distortion.connect(send3);
send3.connect(comp_global);

// Final Mastering
comp_global.connect(gain_master);
gain_master.connect(context.destination);

// EQ wiring
$('#eq-1').change(function () {
	if ($(this).attr('checked') === 'checked') {
		gain_1.disconnect(0);
		gain_1.connect(high_1);
		high_1.connect(mid_1);
		mid_1.connect(low_1);
		low_1.connect(pan_1);		
	} else {
		gain_1.disconnect(0);
		high_1.disconnect(0);
		mid_1.disconnect(0);
		low_1.disconnect(0);		
		gain_1.connect(pan_1);
	}
})
$('#eq-2').change(function () {
	if ($(this).attr('checked') === 'checked') {
		gain_2.disconnect(0);
		gain_2.connect(high_2);
		high_2.connect(mid_2);
		mid_2.connect(low_2);
		low_2.connect(pan_2);		
	} else {
		gain_2.disconnect(0);
		high_2.disconnect(0);
		mid_2.disconnect(0);
		low_2.disconnect(0);		
		gain_2.connect(pan_2);
	}
})
$('#eq-3').change(function () {
	if ($(this).attr('checked') === 'checked') {
		gain_3.disconnect(0);
		gain_3.connect(high_3);
		high_3.connect(mid_3);
		mid_3.connect(low_3);
		low_3.connect(pan_3);		
	} else {
		gain_3.disconnect(0);
		high_3.disconnect(0);
		mid_3.disconnect(0);
		low_3.disconnect(0);		
		gain_3.connect(pan_3);
	}
})
$('#eq-4').change(function () {
	if ($(this).attr('checked') === 'checked') {
		gain_4.disconnect(0);
		gain_4.connect(high_4);
		high_4.connect(mid_4);
		mid_4.connect(low_4);
		low_4.connect(pan_4);		
	} else {
		gain_4.disconnect(0);
		high_4.disconnect(0);
		mid_4.disconnect(0);
		low_4.disconnect(0);		
		gain_4.connect(pan_4);
	}
})

// Mute wiring
$('#mute-1').change(function () {
	if ($(this).attr('checked') === 'checked') {
		vol_1.disconnect(0);
		vol_1.connect(mute_1);
		mute_1.connect(sendmain_1);
	} else {
		vol_1.disconnect(0);
		mute_1.disconnect(0);
		vol_1.connect(sendmain_1);
		vol_1.connect(send1_1);		
		vol_1.connect(send2_1);
		vol_1.connect(send3_1);		
	}
})
$('#mute-2').change(function () {
	if ($(this).attr('checked') === 'checked') {
		vol_2.disconnect(0);
		vol_2.connect(mute_2);
		mute_2.connect(sendmain_2);
	} else {
		vol_2.disconnect(0);
		mute_2.disconnect(0);
		vol_2.connect(sendmain_2);
		vol_2.connect(send1_2);
		vol_2.connect(send2_2);
		vol_2.connect(send3_2);		
	}
})
$('#mute-3').change(function () {
	if ($(this).attr('checked') === 'checked') {
		vol_3.disconnect(0);
		vol_3.connect(mute_3);
		mute_3.connect(sendmain_3);
	} else {
		vol_3.disconnect(0);
		mute_3.disconnect(0);
		vol_3.connect(sendmain_3);
		vol_3.connect(send1_3);
		vol_3.connect(send2_3);	
		vol_3.connect(send3_3);			
	}
})
$('#mute-4').change(function () {
	if ($(this).attr('checked') === 'checked') {
		vol_4.disconnect(0);
		vol_4.connect(mute_4);
		mute_4.connect(sendmain_4);
	} else {
		vol_4.disconnect(0);
		mute_4.disconnect(0);
		vol_4.connect(sendmain_4);
		vol_4.connect(send1_4);
		vol_4.connect(send2_4);
		vol_4.connect(send3_4);		
	}
})