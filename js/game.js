var camera, scene, renderer;
var geometry, material, mesh, cube;
var controls;

var objects = [];

var raycaster, rayLine;

var blocker = document.getElementById( 'blocker' );
var splashscreen = document.getElementById( 'splashscreen' );
var pauseScreen = document.getElementById( 'pause' );
var pauseIcon = document.getElementById( 'pauseIcon' );

var timer = null;
var sec = 0;
var paused = false;
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

} else {

    splashscreen.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

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



    scene = new THREE.Scene();
//        scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);


    var sunLight = new THREE.DirectionalLight(0xffeedd, 1);
    sunLight.position.set(0.3, - 1, - 1).normalize();
    scene.add(sunLight);
    var light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(-500, 1000, 500);
    scene.add(light);
    // This light's color gets applied to all the objects in the scene globally.
    scene.add(new THREE.AmbientLight(0x404040));

    // var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    // light.position.set( 0.5, 1, 0.75 );
    // scene.add( light );


    var loader = new THREE.CubeTextureLoader();


    var urls = [
        "./images/posx.jpg", "./images/negx.jpg", "./images/posy.jpg",
        "./images/negy.jpg", "./images/posz.jpg", "./images/negz.jpg"];
    var textureCube = loader.load(urls);
    console.log(textureCube);

    // ball - cube reflection material
    var ball = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube
    }));
    //ball.scale.x = ball.scale.y = ball.scale.z = Math.random() * 3 + 1;
    ball.position.set(150, 10, 0);
    scene.add(ball);
    objects.push(ball);

    var shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = textureCube;
    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var skybox = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
    skybox.position.set(0,0,0);
    scene.add(skybox);

    geometry = new THREE.BoxGeometry(20,20,20);
    material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    cube = new THREE.Mesh(geometry,material);
    cube.position.x = Math.floor(Math.random()*20-10) * 20;
    cube.position.y = 10;
    cube.position.z = Math.floor(Math.random()*20-10) * 20;
    scene.add(cube);
    objects.push(cube);

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

    var texture = new THREE.TextureLoader().load( "./images/disco.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );


    // box

    // renderer.setClearColor( 0xffffff );
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    if ( controlsEnabled && !paused ) {
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
