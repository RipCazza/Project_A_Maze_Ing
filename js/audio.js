//--- AUDIO ---        
// Create a new instance of an audio object and adjust some of its properties
var audio = new Audio();
audio.src = './mp3/press_start.mp3';
audio.controls = false;
audio.loop = true;
audio.autoplay = true;
// Establish all variables that your Analyser will use
var source, context, analyser, fbc_array, bar_height;
// Initialize the MP3 player after the page loads all of its HTML into the window
window.addEventListener("load", initMp3Player, false);
function initMp3Player(){
    context = new webkitAudioContext(); // AudioContext object instance
    analyser = context.createAnalyser(); // AnalyserNode method
    // Re-route audio playback into the processing graph of the AudioContext
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}
// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
function frameLooper(){
    window.webkitRequestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    bar_height = -(fbc_array[0]);
}