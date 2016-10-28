var scene, renderer;
var geometry, material;
var cube, cubeGlow;
var objects = [];
var gui;
var raycaster, rayLine;
var walls = [];
var myCell;
var speedmodifier = 1;
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var lvl = 1;

/// Framerate checker
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
///

function checkCell() {
    var xPos = controls.getObject().position.x;
    var zPos = controls.getObject().position.z;
    var xMod = Math.floor(xPos / 30 + size / 2);
    var zMod = Math.floor(size - (zPos / 30 + size / 2));
    var cell = zMod * size + xMod;
    return cell;
}

function checkCollision(myCell) {
    var xCell = (myCell.positionx - size / 2) * 30 + 15;
    var zCell = -((myCell.positiony - size / 2) * 30 + 15);
    var walls = myCell.walls;
    var xPos = controls.getObject().position.x;
    var zPos = controls.getObject().position.z;

    if (xPos <= xCell - 8 && walls[3] == true) {
        controls.getObject().position.x = xCell - 8;
    }
    if (xPos >= xCell + 8 && walls[1] == true) {
        controls.getObject().position.x = xCell + 8;
    }
    if (zPos <= zCell - 8 && walls[2] == true) {
        controls.getObject().position.z = zCell - 8;
    }
    if (zPos >= zCell + 8 && walls[0] == true) {
        controls.getObject().position.z = zCell + 8;
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

    geometry = new THREE.PlaneGeometry( 30*size+10, 30*size+10, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );

	var path = "./images/level" + lvl + "/";
    var texture = new THREE.TextureLoader().load( path + "floortexture.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 16, 16 );
    material = new THREE.MeshBasicMaterial( { map: texture} );

    floor = new THREE.Mesh(geometry, material);
    scene.add(floor);

    // create custom material from the shader code

    var posx = -15*(size-1), posz = 15*(size-1);
    var wallPos = [[0,15],[15,0],[0,-15],[-15,0]];
	wallGroup = new THREE.Object3D();
	itemGroup = new THREE.Object3D();
	var shortwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');
	var longwallTexture = new THREE.TextureLoader().load(path + 'walltexture.png');
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
                // power-up / trap blocks
                if(cells[size*i+j].cellfunction == 1)
                {
                    var powerup = new THREE.Mesh(new THREE.CubeGeometry(2,2,2), new THREE.MeshBasicMaterial({color: 0xffffff}));
                    powerup.position.set( posx + wallPos[0][0], 5, posz + wallPos[0][0]);
                    itemGroup.add(powerup);
                }
                else if(cells[size*i+j].cellfunction == 2)
                {
                    var trapcarpet = new THREE.Mesh(new THREE.CubeGeometry(15,0.2,15), wallmat);
                    trapcarpet.position.set( posx + wallPos[0][0], 0.1, posz + wallPos[0][0]);
                    itemGroup.add(trapcarpet);
                }
            }
            posx+=30;
        }
        posx=-15*(size-1);posz-=30;
    }
	scene.add(wallGroup);


    var telematerial = new THREE.MeshBasicMaterial({color: 0x000077, transparent: true, opacity: 0.7});
    var teleportGeo = new THREE.SphereGeometry(3,32,16);
    var teleport = new THREE.Mesh(teleportGeo, telematerial);
    teleport.position.set(15*(size-1),10,15*(size-1));
    itemGroup.add(teleport);
    var glow = new THREE.Mesh(  new THREE.SphereGeometry(6,32,16), new THREE.MeshBasicMaterial({color:0x7777ff, transparent: true, opacity: 0.35}));
    glow.position.set(15*(size-1),10,15*(size-1));
    itemGroup.add( glow );
	scene.add(itemGroup);
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
    cellPos = checkCell();
    if(cellPos >= 0 && cellPos < size * size) {
        myCell = cells[cellPos];
    }
    Move();
    checkCollision(myCell);
    checkCellFunction(cellPos);
    renderer.render( scene, camera );
    // framerate checker
        stats.end();
    requestAnimationFrame( animate );

}

function checkCellFunction(cellnumber)
{
    if (cellPos < (size * size) && cellPos > 0)
    {
        if (cells[cellnumber].cellfunction == 1)
        {
            speedmodifier = 2;
        }
        else if (cells[cellnumber].cellfunction == 2)
        {
            speedmodifier = 0.8;
        }
    }
    return;
}
