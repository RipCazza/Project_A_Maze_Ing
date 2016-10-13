var camera, scene, renderer;
var geometry, material, mesh, cube;
var controls;

var objects = [];

var raycaster, rayLine;

var blocker = document.getElementById( 'blocker' );
var splashscreen = document.getElementById( 'splashscreen' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/


var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            splashscreen.style.display = '';

        }

    };

    var pointerlockerror = function ( event ) {

        splashscreen.style.display = '';

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

    }, false );

} else {

    splashscreen.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    scene = new THREE.Scene();
//        scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

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
                if ( canJump === true ) velocity.y += 350;
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

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

    geometry = new THREE.PlaneGeometry( 500, 500, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

//        for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
//
//            var vertex = geometry.vertices[ i ];
//            vertex.x += Math.random() * 20 - 10;
//            vertex.y += Math.random() * 2;
//            vertex.z += Math.random() * 20 - 10;
//
//        }
//
//        for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
//
//            var face = geometry.faces[ i ];
//            face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
//            face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
//            face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
//
//        }
    var texture = new THREE.TextureLoader().load( "./images/disco.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );


    geometry = new THREE.BoxGeometry (20,20,20);
    material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
    cube.position.y = 10;
    cube.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
    scene.add(cube);
    objects.push(cube);
    console.log(cube.position.x);
    console.log(cube.position.z);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    if ( controlsEnabled ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

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

//            var cameradirection = camera.getWorldDirection();
//            var originpoint = controls.getObject().position.clone();
//            originpoint.x += velocity.x*delta;
//            originpoint.y += velocity.y*delta;
//            originpoint.z += velocity.z*delta;
//            var dx = originpoint.x - cube.position.x;
//            var dz = originpoint.z - cube.position.z;
//            var distance = Math.sqrt(dx*dx+dz*dz);
//            if(dx < 0 && velocity.x < 0 || dx > 0 && velocity.x > 0)
//            {
//                controls.getObject().translateX( velocity.x * delta );
//            }
//            if(dz < 0 && velocity.z < 0 || dz > 0 && velocity.z > 0)
//            {
//                controls.getObject().translateZ( velocity.z * delta );
//            }


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

    renderer.render( scene, camera );

}
