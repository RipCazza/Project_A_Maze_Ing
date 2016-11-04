//--- AUDIO ---        
// Create a new instance of an audio object and adjust some of its properties
        var audio = new Audio();
        audio.src = './mp3/press_start.mp3';
        audio.controls = false;
        audio.loop = true;
        audio.autoplay = true;
        // Establish all variables that your Analyser will use
        var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height, intensity;

        var speedpowerupsound = new Audio('./mp3/smw_1-up.wav');
        var telesound = new Audio('./mp3/smw_balloonmario.wav');
        var timepowerupsound = new Audio('./mp3/smw_switch_timer_ending.wav');
        var trapsound = new Audio('./mp3/smb_bowserfalls.wav');
        var gameoversound = new Audio('./mp3/smb_mariodie.wav');
        var pausesound = new Audio('./mp3/smb_pause.wav');
        var nextlevelsound = new Audio('./mp3/smw_pipe.wav');
        var finishedsound = new Audio('./mp3/smw_course_clear.wav');
        var jumpsound = new Audio('./mp3/smw_jump.wav');

        // Initialize the MP3 player after the page loads all of its HTML into the window
        window.addEventListener("load", initMp3Player, false);
        function initMp3Player(){
            document.getElementById('audio_box').appendChild(audio);
            context = new webkitAudioContext(); // AudioContext object instance
            analyser = context.createAnalyser(); // AnalyserNode method
            canvas = document.getElementById('analyser_render');
            ctx = canvas.getContext('2d');
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

            if (lvl != undefined && gamemode == 0) {
                console.log("HELLOW");
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

                bars = 150;
                for (var i = 0; i < bars; i++) {
                    if (lvl == 1) {
                        ctx.fillStyle = "rgb(0 , " + -bar_height + ", 0)"; // Color of the bars
                    }
                    else if (lvl == 2) {
                        ctx.fillStyle = "rgb(0 , 0, " + -bar_height + ")"; // Color of the bars
                    }
                    else if (lvl == 3) {
                        ctx.fillStyle = "rgb(" + -bar_height + " , 0, 0)"; // Color of the bars
                    }
                    //var analyser_width = document.getElementById('analyser_render').offsetWidth;
                    bar_x = i * 300/bars;
                    bar_width = 300/bars;
                    bar_height = -(fbc_array[i]);
                    //console.log(bar_height);
                    //  fillRect( x, y, width, height ) // Explanation of the parameters below
                    if (i == 0) {
                        intensity = bar_height;
                    }
                    ctx.fillRect(bar_x, 0, bar_width, -bar_height/2);
                }
            }
        }
