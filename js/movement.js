var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
var controls = new THREE.PointerLockControls( camera );
var timer = null;
var velocity = new THREE.Vector3();
var paused = false;

var blocker = document.getElementById( 'blocker' );
var splashscreen = document.getElementById( 'splashscreen' );
var pauseScreen = document.getElementById( 'pause' );
var pauseIcon = document.getElementById( 'pauseIcon' );

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
    splashscreen.addEventListener( 'click', function ( event ) {
        splashscreen.style.display = 'none';
        document.getElementById("intromusic").pause(); document.getElementById("intromusic").currentTime = 0;
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
        if(!timer) {timer = setInterval(setTime, 1000);}7
        document.getElementById("timer-container").style.visibility = "visible";
    }, false );

    pauseScreen.addEventListener( 'click', function ( event ) {
        pauseScreen.style.visibility = 'hidden';
        pauseIcon.style.visibility = 'hidden';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        controlsEnabled = true;
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
            if ( canJump === true ) velocity.y = 350;
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
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );
        console.log(intersections);
        var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( moveForward ) velocity.z -= 400.0 * delta;
        if ( moveBackward ) velocity.z += 400.0 * delta;

        if ( moveLeft ) velocity.x -= 400.0 * delta;
        if ( moveRight ) velocity.x += 400.0 * delta;

        if ( isOnObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
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

