var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
var controls = new THREE.PointerLockControls( camera );
var timer = null;
var velocity = new THREE.Vector3();
var paused = false;
var blocker = document.getElementById( 'blocker' );
var splashscreen = document.getElementById( 'splashscreen' );
var pauseScreen = document.getElementById( 'pause' );
var pauseIcon = document.getElementById( 'pauseIcon' );
var wallGroup, floor;
var sec = 0;
var prevTime = performance.now();
var controlsEnabled = false;

THREEx.FullScreen.bindKey({ charCode : 'f'.charCodeAt(0) });

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;
    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        }
        else {
            controls.enabled = false;
            paused = true;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            pauseScreen.style.visibility = 'visible';
            pauseIcon.style.visibility = 'visible';
            clearInterval(timer);
            timer = null;
            velocity.x = 0;velocity.y=0;velocity.z=0;
			document.getElementById("audio" + lvl).pause();
        }
    };

    var pointerlockerror = function ( event ) {
        pauseScreen.style.display = '-webkit-box';
        pauseScreen.style.display = '-moz-box';
        pauseScreen.style.display = 'box';
    };

	
    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
/*     splashscreen.addEventListener( 'click', function ( event ) {
        splashscreen.style.display = 'none';
        document.getElementById("intromusic").pause(); document.getElementById("intromusic").currentTime = 0;
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
        if(!timer) {timer = setInterval(setTime, 1000);}7
        document.getElementById("timer-container").style.visibility = "visible";
    }, false ); */
	
	function hideSplashScreen(){
		        splashscreen.style.display = 'none';
        document.getElementById("audio0").pause(); document.getElementById("audio0").currentTime = 0;
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
        if(!timer) {timer = setInterval(setTime, 1000);}7
        document.getElementById("timer-container").style.visibility = "visible";
	}

    pauseScreen.addEventListener( 'click', function ( event ) {
        pauseScreen.style.visibility = 'hidden';
        pauseIcon.style.visibility = 'hidden';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        controlsEnabled = true;
		document.getElementById("audio" + lvl).play();
        element.requestPointerLock();
        if(!timer) {timer = setInterval(setTime, 1000);}
        paused = false;
    }, false );

}

else {
    splashscreen.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true; break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;

        case 32: // space
            if ( canJump === true ) velocity.y = 100;
            canJump = false;
            break;
    }

};

var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }

};

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

function Move(){
    if ( controlsEnabled && !paused ) {
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= (10/3) * 100.0 * delta; // 100.0 = mass

        if ( moveForward ) velocity.z -= 400.0 * speedmodifier * delta;
        if ( moveBackward ) velocity.z += 400.0 * speedmodifier * delta;

        if ( moveLeft ) velocity.x -= 400.0 * speedmodifier * delta;
        if ( moveRight ) velocity.x += 400.0 * speedmodifier * delta;

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
     //   console.log("positionx: " + controls.getObject().position.x);
     //   console.log("positionz: " + controls.getObject().position.z);
		
		var teleX = teleZ = 15*(size-1);
		if(Math.abs(controls.getObject().position.x - teleX) <= 3 && Math.abs(controls.getObject().position.z - teleZ) <= 3) {
			if(lvl<3){
                controlsEnabled = false;
                velocity.x = 0;
                velocity.z = 0;
				cancelAnimationFrame(animate);// Stop the animation
				$("body").fadeToggle(100);
				scene.remove(wallGroup);
				scene.remove(floor);
				scene.remove(itemGroup);
                scene.remove(trapGroup);
                scene.remove(powerGroup);
                powerUpCellArray = [];
                size += 2;
				controls.getObject().position.x = -15*(size-1);
                controls.getObject().position.z = -15*(size-1);
                document.getElementById("audio" + lvl).pause(); document.getElementById("audio" + lvl).currentTime = 0;
				speedmodifier = 0;
				cells = [];
				var newseed = (seed + (lvl * 500));
				console.log(newseed);
				lvl++;
                GenerateMaze(newseed, size, lvl);
				initMaze();
				controlsEnabled = true;
				requestAnimationFrame(animate);
			}
			else if(lvl==3){
				cancelAnimationFrame(animate);
				controls.enabled = false;
				controlsEnabled = false;
				velocity.x = 0;velocity.y=0;velocity.z=0;
			EndGame();}
		}
    }
}

function setTime() {
    sec++;
    document.getElementById("seconds").innerHTML = pad(sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
