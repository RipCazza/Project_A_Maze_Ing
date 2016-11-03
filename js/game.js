var scene, renderer;
var geometry, material;
var teleport, glow;
var objects = [];
var gui;
var raycaster, rayLine;
var walls = [];
var myCell;
var speedmodifier = 0;

var xPos;
var zPos;
var yPos;
var xCell;
var zCell;

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var lvl = 1;
var powerupy = 0.02;

/// Framerate checker
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
///

function checkCell() {
    var xMod = Math.floor(xPos / 30 + size / 2);
    var zMod = Math.floor(size - (zPos / 30 + size / 2));
    var cell = zMod * size + xMod;
    return cell;
}

function checkCollision(myCell) {
    var walls = myCell.walls;

    if (xPos <= xCell - 7 && walls[3] == true) {
        controls.getObject().position.x = xCell - 7;
    }
    if (xPos >= xCell + 7 && walls[1] == true) {
        controls.getObject().position.x = xCell + 7;
    }
    if (zPos <= zCell - 7 && walls[2] == true) {
        controls.getObject().position.z = zCell - 7;
    }
    if (zPos >= zCell + 7 && walls[0] == true) {
        controls.getObject().position.z = zCell + 7;
    }

    if (xPos <= xCell -7 && zPos <= zCell -7 && !(walls[2] || walls[3])) {
        if (Math.abs(Math.abs(xPos) - Math.abs(xCell)) < Math.abs(Math.abs(zPos) - Math.abs(zCell))) {
            controls.getObject().position.x = xCell - 7;
        }
        else {
            controls.getObject().position.z = zCell - 7;
        }
    }
    if (xPos >= xCell +7 && zPos >= zCell +7 && !(walls[0] || walls[1])) {
        if (Math.abs(Math.abs(xPos) - Math.abs(xCell)) < Math.abs(Math.abs(zPos) - Math.abs(zCell))) {
            controls.getObject().position.x = xCell + 7;
        }
        else {
            controls.getObject().position.z = zCell + 7;
        }
    }
    if (xPos <= xCell -7 && zPos >= zCell +7 && !(walls[0] || walls[3])) {
        if (Math.abs(Math.abs(xPos) - Math.abs(xCell)) < Math.abs(Math.abs(zPos) - Math.abs(zCell))) {
            controls.getObject().position.x = xCell - 7;
        }
        else {
            controls.getObject().position.z = zCell + 7;
        }
    }
    if (xPos >= xCell +7 && zPos <= zCell -7 && !(walls[2] || walls[1])) {
        if (Math.abs(Math.abs(xPos) - Math.abs(xCell)) < Math.abs(Math.abs(zPos) - Math.abs(zCell))) {
            controls.getObject().position.x = xCell + 7;
        }
        else {
            controls.getObject().position.z = zCell - 7;
        }
    }
}

function init(level) {
	lvl = level;
    scene = new THREE.Scene();
//    scene.fog =  new THREE.Fog(0x000000, 0,100);
    // LIGHT
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

    
    scene.add( controls.getObject() );
	controls.getObject().position.set(-15*(size-1),0,-15*(size-1));
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

	initMaze();
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

function initMaze(){
	$("body").css("background-image", "url('images/level" + lvl + "/background.jpg')");

    geometry = new THREE.PlaneGeometry( 30*size, 30*size, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

	var path = "./images/level" + lvl + "/";
    var texture = new THREE.TextureLoader().load( path + "floortexture.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2*size, 2*size );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    floor = new THREE.Mesh(geometry, material);
    scene.add(floor);

    // create custom material from the shader code

    var posx = -15*(size-1), posz = 15*(size-1);
    var wallPos = [[0,15],[15,0],[0,-15],[-15,0]];
	wallGroup = new THREE.Object3D();
    itemGroup = new THREE.Object3D();
	trapGroup = new THREE.Object3D();
    powerGroup = new THREE.Object3D();
    var powerupTexture = new THREE.TextureLoader().load('images/power-up.png');
    var powerupunderTexture = new THREE.TextureLoader().load('images/power-up_under.png');
    var timeupTexture = new THREE.TextureLoader().load('images/Time_up.jpg');
    var timeupunderTexture = new THREE.TextureLoader().load('images/Time_up_under.jpg');
	var shortwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');
    var traptexture = new THREE.TextureLoader().load(path + 'trap.png');
	var longwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');
    var testwalltexture = new THREE.TextureLoader().load('./images/Test border Funky cube.png');
	longwallTexture.wrapS = THREE.RepeatWrapping;
	longwallTexture.wrapT = THREE.RepeatWrapping;
	longwallTexture.repeat.set(2,1);
    var wallmat = new THREE.MeshBasicMaterial( { map: shortwallTexture});
    var trapmat = new THREE.MeshBasicMaterial( { map: traptexture, transparent: true});
    var wallmat2 = new THREE.MeshBasicMaterial( { map: longwallTexture});
	var plainmat = new THREE.MeshBasicMaterial({color: 0xa0ff43});
    var powerupsidemat = new THREE.MeshBasicMaterial( { map: powerupTexture});
    var powerupundermat = new THREE.MeshBasicMaterial( { map: powerupunderTexture});
    var timerupsidemat = new THREE.MeshBasicMaterial( { map: timeupTexture});
    var timeupundermat = new THREE.MeshBasicMaterial( { map: timeupunderTexture});
	var faces = [wallmat,wallmat, plainmat, plainmat, wallmat, wallmat];
	var faces2 = [wallmat2,wallmat2, plainmat, plainmat, wallmat2, wallmat2];
	var shortwallmat = new THREE.MeshFaceMaterial(faces);
	var longwallmat = new THREE.MeshFaceMaterial(faces2);
    var faces = [powerupsidemat,powerupsidemat, powerupundermat, powerupundermat, powerupsidemat, powerupsidemat];
    var powerupmat = new THREE.MeshFaceMaterial(faces);
    var faces = [timerupsidemat,timerupsidemat, timeupundermat, timeupundermat, timerupsidemat, timerupsidemat];
    var timerupmat = new THREE.MeshFaceMaterial(faces);
//    var powerupmat2 = new THREE.MeshBasicMaterial({color: 0xa0ff43})
    
    if (gamemode == 0)
    {
        longwallmat = new THREE.MeshBasicMaterial( { map: longwallTexture});
        shortwallmat = new THREE.MeshBasicMaterial(  wallmat);
    }

    for(var i=0;i<size;i++)
    {
        for(var j=0;j<size;j++)
        {
            for(var k=0;k<4;k++)
            {
                // walls
                if(cells[size*i+j].walls[k] == true)
                {
                    if( k==0)
                    {
                        // longwall
                        var wall = new THREE.Mesh(new THREE.CubeGeometry(20,20,10),longwallmat);
                        wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                        wallGroup.add(wall);objects.push(wall)
                    }
                    else if (k == 1)
                    {
                        //longwall
                        var wall = new THREE.Mesh(new THREE.CubeGeometry(10,20,20), longwallmat);
                        wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                        wallGroup.add(wall);objects.push(wall);
                    }
                }
                // shortwalls
                var wall = new THREE.Mesh(new THREE.CubeGeometry(10,20,10), shortwallmat);
                if (k == 0)
                {
                    //shortwall
                    wall.position.set(15 + posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                    wallGroup.add(wall);objects.push(wall);
                }
                else if ((k == 2) && (i == (size -1)))
                {
                    //shortwall
                    wall.position.set(15 + posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                    wallGroup.add(wall);objects.push(wall);
                                    
                     //longwall
                    var wall = new THREE.Mesh(new THREE.CubeGeometry(20,20,10),longwallmat);
                    wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                    wallGroup.add(wall);objects.push(wall)
                }
                else if ((k == 3) && (j == 0))
                {
                    //shortwall
                    wall.position.set(posx + wallPos[k][0], 10, 15 + posz + wallPos[k][1]);
                    wallGroup.add(wall);objects.push(wall);
                                    
                    //longwall
                    var wall = new THREE.Mesh(new THREE.CubeGeometry(10,20,20), longwallmat);
                    wall.position.set( posx + wallPos[k][0], 10, posz + wallPos[k][1]);
                    wallGroup.add(wall);objects.push(wall);
                }
//                            if ((k == 1) && (j == 0) && (i == 0))
//                                {
//                                    wall.position.set(posx + wallPos[k][0], 10, 15 + posz + wallPos[k][1]);
//                                    wallGroup.add(wall);objects.push(wall);
//                                }
            }
            // power-up / trap blocks
            if(cells[size*i+j].cellfunction == 1)
            {
                var powerup = new THREE.Mesh(new THREE.CubeGeometry(3,3,3),powerupmat);
                powerup.position.set( posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                powerGroup.add(powerup);
            }
            else if(cells[size*i+j].cellfunction == 2)
            {
                var trapcarpet = new THREE.Mesh(new THREE.CubeGeometry(15,0.001,15), trapmat);
                trapcarpet.position.set( posx + wallPos[0][0], 0, posz + wallPos[0][0]);
                trapGroup.add(trapcarpet);
            }
            else if(cells[size*i+j].cellfunction == 3)
            {
                var powerup2 =new THREE.Mesh(new THREE.CubeGeometry(3,3,3), timerupmat );
                powerup2.position.set (posx + wallPos[0][0], 4, posz + wallPos[0][0]);
                itemGroup.add(powerup2);
            }
            posx+=30;
        }
        posx=-15*(size-1);posz-=30;
    }
	scene.add(wallGroup);
    
    var telematerial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./images/teleport.jpg")});
    telematerial.side = THREE.DoubleSide;
    var teleportGeo = new THREE.CircleGeometry( 6, 16 );//SphereGeometry(3,32,16);
    teleport = new THREE.Mesh(teleportGeo, telematerial);
    teleport.position.set(15*(size-1),10,15*(size-1));
    itemGroup.add(teleport);
    glow = new THREE.Mesh(  new THREE.TorusGeometry(7,1.5, 16, 30), new THREE.MeshBasicMaterial({color:0x333333}));
    glow.position.set(15*(size-1),10,15*(size-1));
    itemGroup.add( glow );
	scene.add(itemGroup);
    scene.add(trapGroup);
    scene.add(powerGroup);
	speedmodifier = 1;	
	$("body").fadeToggle(3000);
//	document.getElementById("audio" + lvl).play();
    
    // AUDIO
    audio.src = './mp3/level' + lvl + '.mp3';

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
    // cubeGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, cubeGlow.position );
    
    xPos = controls.getObject().position.x;
    zPos = controls.getObject().position.z;
    yPos = controls.getObject().position.y;

    cellPos = checkCell();
    if(cellPos >= 0 && cellPos < size * size) {
        myCell = cells[cellPos];
    }
    
    xCell = (myCell.positionx - size / 2) * 30 + 15;
    zCell = -((myCell.positiony - size / 2) * 30 + 15);

    Move();
    
    xPos = controls.getObject().position.x;
    zPos = controls.getObject().position.z;
    
    teleport.rotation.y += Math.PI/180;glow.rotation.y+= Math.PI/180;
    checkCollision(myCell);
    checkCellFunction(cellPos);
    renderer.render( scene, camera );
    // framerate checker
        stats.end();
    // AUDIO
    requestAnimationFrame( animate );
        console.log(time);
    
    // change color
    if (gamemode == 0)
    {
        var wallarray = wallGroup.children;
        var traparray = trapGroup.children;
        var powerarray = powerGroup.children;
        switch (lvl)
        {
            case (1):
                wallarray[0].material.color.setRGB( Math.abs(bar_height * 0.001), Math.abs(bar_height * 0.005), Math.abs(bar_height * 0.001));
                wallarray[1].material.color.setRGB( Math.abs(bar_height * 0.001), Math.abs(bar_height * 0.005), Math.abs(bar_height * 0.001));
                break;
            case (2):
                wallarray[0].material.color.setRGB( Math.abs(bar_height * 0.0015), Math.abs(bar_height * 0.0015), Math.abs(bar_height * 0.005));
                wallarray[1].material.color.setRGB( Math.abs(bar_height * 0.0015), Math.abs(bar_height * 0.0015), Math.abs(bar_height * 0.005));
                floor.material.color.setRGB( 0.1 + Math.abs(bar_height * 0.0015), 0.1 + Math.abs(bar_height * 0.0015), 0.1 + Math.abs(bar_height * 0.0015));
                break;
            case (3):
                wallarray[0].material.color.setRGB( Math.abs(bar_height * 0.005), 0, 0);
                wallarray[1].material.color.setRGB( Math.abs(bar_height * 0.005), 0, 0);
                traparray[0].material.color.setRGB( Math.abs(bar_height * 0.0065), 0, 0);
                floor.material.color.setRGB( Math.abs(bar_height * 0.005), 0, 0);
                break
        }
    }
    // power-up rotation
    if (powerGroup.children[0].position.y > 8 || powerGroup.children[0].position.y < 5)
    {
        powerupy *= -1;
    }
    for (x = 0; x < powerGroup.children.length; x++)
    {
        powerGroup.children[x].rotation.y += Math.PI/180;
        powerGroup.children[x].position.y += powerupy;
    }
}

function checkCellFunction(cellnumber)
{
    if (cellPos < (size * size) && cellPos > 0)
    {
        switch (cells[cellnumber].cellfunction)
        {
            case 1:
                if (xPos >= xCell - 4.5 && xPos <= xCell +4.5 && zPos >= zCell - 4.5 && zPos <= zCell +4.5 && yPos <= 16.5) {
                    speedmodifier = 1.5;
                }
                break;
            case 2:
                if (xPos >= xCell - 7.5 && xPos <= xCell +7.5 && zPos >= zCell - 7.5 && zPos <= zCell +7.5 && yPos <= 10.2) {
                    speedmodifier = 0.75;
                }
                break;
            case 3:
                sec -=10;
                break;
        }
    }
    return;
}

function EndGame()
{
			document.getElementById("audio3").pause();
	        clearInterval(timer);
            timer = null;
	        blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
			var elem = document.getElementById('pause');
			elem.parentNode.removeChild(elem);
			elem = document.getElementById('pauseIcon');
			elem.parentNode.removeChild(elem);
            document.getElementById("end").style.visibility = 'visible';			
			document.getElementById("yourSeed").innerHTML = "Your seed: " + seed;
			document.getElementById("finalTime").innerHTML = "Final time: " + document.getElementById("minutes").innerHTML + " minutes and " + document.getElementById("seconds").innerHTML + " seconds";
			document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
			// Attempt to unlock
			document.exitPointerLock();
			
			}
