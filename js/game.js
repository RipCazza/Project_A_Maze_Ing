// --- MAIN GAME ---
var scene, renderer;
var geometry, material;
var teleport, glow;
var objects = [];
var gui;
var raycaster, rayLine;
var walls = [];
var myCell;
var speedmodifier = 0;
var powerUpCellArray = [];
var teleRandomArray = [];

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
//var stats = new Stats();
//stats.showPanel( 0 );
//document.body.appendChild( stats.dom );
///

function checkCell() {
    var xMod = Math.floor(xPos / 30 + size / 2);
    var zMod = Math.floor(size - (zPos / 30 + size / 2));
    var cell = zMod * size + xMod;
    return cell;
}

function checkCollision(myCell) {
    var walls = myCell.walls;
//    console.log(walls);
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
    var canvas = document.getElementById("canvasID");
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvas
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xffffff, 0);

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}

function initMaze(){
//    if (seednumber == 7777) {
//        scene.fog =  new THREE.Fog(0xFFC0CB, 0,100);
//    }
//    else
    if (lvl == 1) {
        scene.fog =  new THREE.Fog(0x001E00, 0,100);
    }
    else if (lvl == 2) {
        scene.fog =  new THREE.Fog(0x00001E, 0,100);
    }
    else if (lvl == 3) {
        scene.fog =  new THREE.Fog(0x1E0000, 0,100);
    }
    if (gamemode == 1) {
        $("body").css("background-image", "url('images/level" + lvl + "/background.jpg')");
    }
    else {
//        if (seednumber == 7777) {
//            $("body").css("background-color", "rgb(255,192,203)");
//        }
//        else
        if (lvl == 1) {
            $("body").css("background-color", "rgb(0, 30, 0)");
        }
        else if (lvl == 2) {
            $("body").css("background-color", "rgb(0, 0, 30)");
        }
        else if (lvl == 3) {
            $("body").css("background-color", "rgb(30, 0, 0)");
        }
    }

    geometry = new THREE.PlaneGeometry( 30*size, 30*size, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

    var path = "./images/level" + lvl + "/";

    var powerupTexture, powerupunderTexture, timeupTexture, timeupunderTexture, shortwallTexture, traptexture, longwallTexture, teleTexture, teleunderTexture, texture;
//    if (seednumber == 7777) {
//        powerupTexture = powerupunderTexture = timeupTexture = timeupunderTexture = shortwallTexture = traptexture = traptexture = longwallTexture = teleTexture = teleunderTexture = texture = new THREE.TextureLoader().load('images/david.png');
//    }
        texture = new THREE.TextureLoader().load( path + "floortexture.jpg" );
        powerupTexture = new THREE.TextureLoader().load('images/power-up.png');
        powerupunderTexture = new THREE.TextureLoader().load('images/power-up_under.png');
        timeupTexture = new THREE.TextureLoader().load('images/Time_up.jpg');
        timeupunderTexture = new THREE.TextureLoader().load('images/Time_up_under.jpg');
        shortwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');
        traptexture = new THREE.TextureLoader().load(path + 'trap.png');
        longwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');


        teleTexture = new THREE.TextureLoader().load('images/tele.jpg');
        teleunderTexture = new THREE.TextureLoader().load('images/tele_upper.jpg');

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

    var telesidemat = new THREE.MeshBasicMaterial( { map: teleTexture});
    var teleundermat = new THREE.MeshBasicMaterial( { map: teleunderTexture});
    var faces = [telesidemat,telesidemat, teleundermat, teleundermat, telesidemat, telesidemat];
    var telemat = new THREE.MeshFaceMaterial(faces);
    
    
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
    
    var faces = [powerupsidemat,powerupsidemat, powerupundermat, powerupundermat, powerupsidemat, powerupsidemat];
    var powerupmat = new THREE.MeshFaceMaterial(faces);
    var faces = [timerupsidemat,timerupsidemat, timeupundermat, timeupundermat, timerupsidemat, timerupsidemat];
    var timerupmat = new THREE.MeshFaceMaterial(faces);
    var teleportermat = new THREE.MeshBasicMaterial({color: 0xa0ff43});
    
    var longwallmat = new THREE.MeshBasicMaterial( { map: longwallTexture});
    var shortwallmat = new THREE.MeshBasicMaterial(  wallmat);

    if (lvl == 2)
    {
        var lvl2upperTexture = new THREE.TextureLoader().load(path + 'upper_2.png');
        var lvl2uppermat = new THREE.MeshBasicMaterial( { map: lvl2upperTexture});
        var faces = [wallmat,wallmat, lvl2uppermat, lvl2uppermat, wallmat, wallmat];
	   var faces2 = [wallmat2,wallmat2, lvl2uppermat, lvl2uppermat, wallmat2, wallmat2];
	   shortwallmat = new THREE.MeshFaceMaterial(faces);
	   longwallmat = new THREE.MeshFaceMaterial(faces2);  
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
                else if ((k == 1) && (j == 0)&& (i == (size -1)))
                {
                    //shortwall
                    wall.position.set( -15 + posx , 10, -15 + posz);
                    wallGroup.add(wall);objects.push(wall);
                }
            }
            // power-up / trap blocks
            if(cells[size*i+j].cellfunction == 1)
            {
                var powerup = new THREE.Mesh(new THREE.CubeGeometry(3,3,3),powerupmat);
                powerup.position.set( posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                powerGroup.add(powerup);
                powerUpCellArray.push([size*i+j, powerup]);
            }
            else if(cells[size*i+j].cellfunction == 2)
            {
                var trapcarpet = new THREE.Mesh(new THREE.CubeGeometry(15,0.001,15), trapmat);
                trapcarpet.position.set( posx + wallPos[0][0], 0, posz + wallPos[0][0]);
                trapGroup.add(trapcarpet);
                powerUpCellArray.push([size*i+j, trapcarpet]);
            }
            else if(cells[size*i+j].cellfunction == 3)
            {
                var powerup2 = new THREE.Mesh(new THREE.CubeGeometry(3,3,3), timerupmat );
                powerup2.position.set (posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                powerGroup.add(powerup2);
                powerUpCellArray.push([size*i+j, powerup2]);
            }
            else if(cells[size*i+j].cellfunction == 4){
                var trapcarpet2 = new THREE.Mesh(new THREE.CubeGeometry(15, 0.001, 15), trapmat);
                trapcarpet2.position.set (posx +wallPos[0][0], 0, posz + wallPos[0][0]);
                trapGroup.add(trapcarpet2);
                powerUpCellArray.push([size*i+j, trapcarpet2]);
            }
            else if(cells[size*i+j].cellfunction == 5){
                var powerup3 = new THREE.Mesh(new THREE.CubeGeometry(3,3,3), telemat);
                powerup3.position.set (posx +wallPos[0][0], 5, posz + wallPos[0][0]);
                powerGroup.add(powerup3);
                var teleRandom = random();
                teleRandomArray.push([size*i+j, teleRandom]);
                powerUpCellArray.push([size*i+j, powerup3]);
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
    document.getElementById("timer-container").style.visibility = "visible";
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
//    var time = performance.now() / 1000;
    //stats.begin();
    // cubeGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position, cubeGlow.position );
    
    xPos = controls.getObject().position.x;
    zPos = controls.getObject().position.z;
    yPos = controls.getObject().position.y;
    cellPos = checkCell();
    if(cellPos >= 0 && cellPos < size * size) 
    {
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
        //stats.end();
    // AUDIO
    requestAnimationFrame( animate );
    
    // change color
    if (gamemode == 0)
    {
        FunkyColors();
    }
    // power-up rotation
    if (powerGroup.children[0].position.y > 6 || powerGroup.children[0].position.y < 4)
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
                    speedmodifier = 1.3;
                    RemovePowerUp();
                    myCell.cellfunction = 0;
                    speedpowerupsound.loop = false;
                    speedpowerupsound.play();
                }
                break;
            case 2:
                if (xPos >= xCell - 7.5 && xPos <= xCell +7.5 && zPos >= zCell - 7.5 && zPos <= zCell +7.5 && yPos <= 10.2) {
                    speedmodifier = 0.75;
                    trapsound.loop = false;
                    trapsound.play();
                }
                break;
            case 3:
                if (xPos >= xCell - 4.5 && xPos <= xCell +4.5 && zPos >= zCell - 4.5 && zPos <= zCell +4.5 && yPos <= 16.5) {
                    sec -=10;
                    RemovePowerUp();
                    myCell.cellfunction = 0;
                    timepowerupsound.loop = false;
                    timepowerupsound.play();
                }
                break;
            case 4:
                if (xPos>= xCell - 7.5 && xPos <= xCell + 7.5 && zPos >=zCell - 7.5 && zPos <= zCell +7.5 && yPos <=10.2){
                    controlpause = false;
                    GameOver();
                    audio.pause();
                    gameoversound.loop = false;
                    gameoversound.play();
                }
                break;
            case 5:
                if (xPos >= xCell - 4.5 && xPos <= xCell +4.5 && zPos >= zCell - 4.5 && zPos <= zCell +4.5 && yPos <= 16.5) {
                    controls.getObject().position.x = Math.floor(Teleport() * (size - 1)) * 30 - size * 30 / 2 + 15;
                    controls.getObject().position.z = Math.floor(Teleport() * (size - 1)) * 30 - size * 30 / 2 + 15;
                    RemovePowerUp();
                    myCell.cellfunction = 0;
                    telesound.loop = false;
                    telesound.play();
                }
                break;
        }
    }
    return;
}

// Uses seed for predictable outcome
function random()
{
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function RemovePowerUp() {
    for (powerUpCell of powerUpCellArray) {
        if(powerUpCell[0] == cellPos){
            powerGroup.remove(powerUpCell[1])
            scene.remove(powerUpCell[1]);
        }
    }
}

function Teleport() {
    for (teleRandom of teleRandomArray) {
        if(teleRandom[0] == cellPos){
            return teleRandom[1];
        }
    }
}

function EndGame()
{
    controlpause = false;
    audio.pause();
    document.getElementById("timer-container").style.visibility = "hidden";
    finishedsound.loop = false;
    finishedsound.play();
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
    document.getElementById("yourSeed").innerHTML = "Your seed: " + seednumber;
    document.getElementById("finalTime").innerHTML = "Final time: " + document.getElementById("minutes").innerHTML + " minutes and " + document.getElementById("seconds").innerHTML + " seconds";
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    // Attempt to unlock
    document.exitPointerLock();

}

function FunkyColors()
{
     var wallarray = wallGroup.children;
    var traparray = trapGroup.children;
    var powerarray = powerGroup.children;

    //change colors per level
    switch (lvl)
    {
        case (1):
            wallarray[0].material.color.setRGB( Math.abs(intensity * 0.001), Math.abs(intensity * 0.005), Math.abs(intensity * 0.001));
            wallarray[1].material.color.setRGB( Math.abs(intensity * 0.001), Math.abs(intensity * 0.005), Math.abs(intensity * 0.001));
            traparray[0].material.color.setRGB( Math.abs(intensity * 0.001),  Math.abs(intensity * 0.005), Math.abs(intensity * 0.001));
            floor.material.color.setRGB( 0.1 + Math.abs(intensity * 0.001), 0.1 + Math.abs(intensity * 0.005), 0.1 + Math.abs(intensity * 0.001));
            break;
        case (2):
            for (var x = 0; x <wallarray.length; x++ )
            {
                for(test of wallarray[x].material.materials)
                {
                    test.color.setRGB( Math.abs(intensity * 0.0015),  Math.abs(intensity * 0.0015), Math.abs(intensity * 0.005));
                }
            }
            traparray[0].material.color.setRGB( Math.abs(intensity * 0.0015),  Math.abs(intensity * 0.0015), Math.abs(intensity * 0.005));
            floor.material.color.setRGB( 0.1 + Math.abs(intensity * 0.0015), 0.1 + Math.abs(intensity * 0.0015), 0.1 + Math.abs(intensity * 0.005));
            break;
        case (3):
            wallarray[0].material.color.setRGB( Math.abs(intensity * 0.005), 0, 0);
            wallarray[1].material.color.setRGB( Math.abs(intensity * 0.005), 0, 0);
            traparray[0].material.color.setRGB( Math.abs(intensity * 0.0065), 0, 0);
            floor.material.color.setRGB( Math.abs(intensity * 0.005), 0, 0);
            break
    }
    // change colors of cubes
    for (var x = 0; x <powerGroup.children.length; x++ )
    {
        for(test of powerGroup.children[x].material.materials)
        {
            test.color.setRGB( Math.abs(intensity * 0.005),  Math.abs(intensity * 0.005), Math.abs(intensity * 0.005));
        }
    }
    
}

function GameOver(){
    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';
    var elem = document.getElementById('pause');
    elem.parentNode.removeChild(elem);
	elem = document.getElementById('pauseIcon');
	elem.parentNode.removeChild(elem);
    elem = document.getElementById('end');
	elem.parentNode.removeChild(elem);
    document.getElementById("death").style.visibility ='visible';
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    // Attempt to unlock
    document.exitPointerLock();
			
}
