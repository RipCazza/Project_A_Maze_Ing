var camera, scene, renderer;
var geometry, material;
var cube, cubeGlow;
var objects = [];
var gui;
var raycaster, rayLine;
var controlsEnabled = false;

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);

    var sunLight = new THREE.DirectionalLight(0xffeedd, 1);
    sunLight.position.set(0.3, - 1, - 1).normalize();
    scene.add(sunLight);
    var light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(-500, 1000, 500);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x404040));

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    var loader = new THREE.CubeTextureLoader();

    var urls = [
        "./images/posx.jpg", "./images/negx.jpg", "./images/posy.jpg",
        "./images/negy.jpg", "./images/posz.jpg", "./images/negz.jpg"];
    var textureCube = loader.load(urls);

    var ball = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube
    }));

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
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

    geometry = new THREE.PlaneGeometry( 500, 500, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

    var texture = new THREE.TextureLoader().load( "./images/disco.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    var floor = new THREE.Mesh(geometry, material);
    scene.add(floor);

    // create custom material from the shader code

    var customMaterial = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                "c":   { type: "f", value: 0.25 },
                "p":   { type: "f", value: 1.2 },
                glowColor: { type: "c", value: new THREE.Color(0x0000ff) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }   );
    //


    material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    var cubeGeom = new THREE.BoxGeometry(20,20,20,2,2,2);
    cube = new THREE.Mesh(cubeGeom, material);
    cube.position.x = Math.floor(Math.random()*20-10) * 20;
    cube.position.y = 10;
    cube.position.z = Math.floor(Math.random()*20-10) * 20;
    scene.add(cube);
    objects.push(cube);

    var smoothCubeGeom = cubeGeom.clone();
    var modifier = new THREE.SubdivisionModifier( 2 );
    modifier.modify( smoothCubeGeom );

    cubeGlow = new THREE.Mesh( smoothCubeGeom, customMaterial.clone() );
    cubeGlow.position.set(cube.position.x,cube.position.y,cube.position.z);
    cubeGlow.scale.multiplyScalar(1.5);
    scene.add( cubeGlow );

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    animate();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

    requestAnimationFrame( animate );
    cubeGlow.material.uniforms.viewVector.value =
        new THREE.Vector3().subVectors( camera.position, cubeGlow.position );

    Move();

    renderer.render( scene, camera );

}


