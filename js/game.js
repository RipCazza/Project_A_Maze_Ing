var camera, scene, renderer;
var geometry, material;
var cube, cubeGlow;
var objects = [];
var gui;
var raycaster, rayLine;
var controlsEnabled = false;
var walls = [];
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var timer = null;
var sec = 0;

/// Framerate checker
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
///

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

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

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

    geometry = new THREE.PlaneGeometry( 30*size+10, 30*size+10, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

    var texture = new THREE.TextureLoader().load( "./images/grass2.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 16, 16 );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    var floor = new THREE.Mesh(geometry, material);
    scene.add(floor);

    // create custom material from the shader code

	var wallGroup = new THREE.Object3D();
    var posx = -15*(size-1), posz = -15*(size-1);
    var wallPos = [[0,-15],[15,0],[0,15],[-15,0]];
	var shortwallTexture = new THREE.TextureLoader().load('./images/walltexture.png');
	var longwallTexture = new THREE.TextureLoader().load('./images/walltexture.png');
	longwallTexture.wrapS = THREE.RepeatWrapping;
	longwallTexture.wrapT = THREE.RepeatWrapping;
	longwallTexture.repeat.set(2,1);
    var wallmat = new THREE.MeshBasicMaterial( { map: shortwallTexture});
    var wallmat2 = new THREE.MeshBasicMaterial( { map: longwallTexture});
	var plainmat = new THREE.MeshBasicMaterial({color: 0xa0ff43});
	var faces = [wallmat,wallmat, plainmat, plainmat, wallmat, wallmat];
	var faces2 = [wallmat2,wallmat2, plainmat, plainmat, wallmat2, wallmat2];
	var shortwallmat = new THREE.MeshFaceMaterial(faces);
	var longwallmat = new THREE.MeshFaceMaterial(faces2);


    for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
            for(var k=0;k<4;k++)
            {
                  // walls
                    if(cells[size*i+j].walls[k] == true)
                    {
                        if(k==0 || k==2)
                        {
<<<<<<< HEAD
                            // longwall
                            var wall = new THREE.Mesh(new THREE.CubeGeometry(20,20,10),wallmat);
                            wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                            wallGroup.add(wall);objects.push(wall)
                        }
                        else
                        {
                            //longwall
                            var wall = new THREE.Mesh(new THREE.CubeGeometry(10,20,20),wallmat);
                            wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                            wallGroup.add(wall);objects.push(wall);
                    }
                }
                // shortwalls
                            var wall = new THREE.Mesh(new THREE.CubeGeometry(10,20,10), wallmat);
                            if (k == 0)
                            {
                                wall.position.set(15 + posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                                wallGroup.add(wall);objects.push(wall);
                            }
                            if ((k == 2) && (i == (size -1)))
                                {
                                    wall.position.set(15 + posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                                    wallGroup.add(wall);objects.push(wall);
                                }
                            if ((k == 3) && (j == 0))
                                {
                                    wall.position.set(posx + wallPos[k][0], 10, 15 + posz + wallPos[k][1]);
                                    wallGroup.add(wall);objects.push(wall);
                                }
                            if ((k == 1) && (j == 0) && (i == (size -1)))
                                {
                                    wall.position.set(posx + wallPos[k][0], 10, -15 + posz + wallPos[k][1]);
                                    wallGroup.add(wall);objects.push(wall);
                                }
                        // power-up / trap blocks
                            if(cells[size*i+j].cellfunction == 1)
                            {
                                var test = new THREE.Mesh(new THREE.CubeGeometry(2,2,2), new THREE.MeshBasicMaterial({color: 0xffffff}));
                           test.position.set( posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                            scene.add(test);
                        }
                        else if(cells[size*i+j].cellfunction == 2)
                            {
                                var test = new THREE.Mesh(new THREE.CubeGeometry(2,2,2), new THREE.MeshBasicMaterial({color: 0x000000}));
                            test.position.set( posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                            scene.add(test);
                        }
            }
            posx+=30;
        }
        posx=-15*(size-1);posz+=30;
    }
	scene.add(wallGroup);


    var telematerial = new THREE.MeshBasicMaterial({color: 0x000077, transparent: true, opacity: 0.7});
    var teleportGeo = new THREE.SphereGeometry(3,32,16);
    var teleport = new THREE.Mesh(teleportGeo, telematerial);
    teleport.position.set(teleportPosition[0],10,teleportPosition[1]);
    scene.add(teleport);
    var glow = new THREE.Mesh(  new THREE.SphereGeometry(6,32,16), new THREE.MeshBasicMaterial({color:0x7777ff, transparent: true, opacity: 0.35}));
    glow.position.set(teleportPosition[0],10,teleportPosition[1]);
    scene.add( glow );

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xffffff, 0);

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
    //framerate checker
    var time = performance.now() / 1000;
    stats.begin();
    
    requestAnimationFrame( animate );
    // cubeGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, cubeGlow.position );
    Move();
    renderer.render( scene, camera );
    // framerate checker
        stats.end();

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


