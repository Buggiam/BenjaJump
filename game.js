var canvas;

var noUpdateTicks = 0;

var configFile;
var useHost;
var host;

var mapPath;

var levelsFile;

var barPath;

var backgroundPath;
var backgroundsFile;

var tilesPath;
var tilesFile;

var scl;
var canvasWidth = 30;
var canvasHeight = 15;
var borderHeight = 0;

var oldScl;

var player;
var gui;

var right = false;
var left = false;
var up = false;
var down = false;

var map;

var level;

function preload() {
    loadFiles();

    scaleCanvas();
}

function setup() {
    canvas = createCanvas(canvasWidth * scl, canvasHeight * scl);
    canvas.parent('sketch-holder');

    oldScl = scl;

    player = new Player();
    gui = new GUI();

    loadMap();
}

function draw() {
    if (noUpdateTicks > 0) {
        noUpdateTicks--;
    } else
        tick();

    map.draw();

    gui.show();

    player.show();
}

function tick() {
    move();

    player.tick();
    player.playerTick();
}

function loadFiles() { //LEVEL, TILES
    configFile = loadJSON("config.json", loadFiles2);
}

function loadFiles2() { //LEVEL, TILES
    useHost = (configFile.useHost == "true");
    host = useHost ? configFile.host : "";

    console.log("Using host?");
	console.log(useHost);
	console.log("Host='" + host + "'");

    levelsFile = loadJSON((useHost ? host : "") + "assets/levels.json", loadLevel);
    backgroundsFile = loadJSON((useHost ? host : "") + "assets/backgrounds.json", loadBackgrounds);
    tilesFile = loadJSON((useHost ? host : "") + "assets/tiles.json", loadTiles);

    addLoadedImage("assets/player/default/stand0.png");
    addLoadedImage("assets/player/default/stand1.png");

    addLoadedImage("assets/player/default/idle0.png");
    addLoadedImage("assets/player/default/idle1.png");

    addLoadedImage("assets/player/default/run0.png");
    addLoadedImage("assets/player/default/run1.png");
    addLoadedImage("assets/player/default/run2.png");
    addLoadedImage("assets/player/default/run3.png");
    addLoadedImage("assets/player/default/run4.png");

    addLoadedImage("assets/player/default/air0.png");

    addLoadedImage("assets/player/default/jump0.png");
    addLoadedImage("assets/player/default/jump1.png");
    addLoadedImage("assets/player/default/jump2.png");
    addLoadedImage("assets/player/default/jump3.png");

    addLoadedImage("assets/player/default/wall0.png");

    addLoadedImage("assets/player/default/duck0.png");

    addLoadedImage("assets/icon/heart.png");
    addLoadedImage("assets/icon/slot.png");
    addLoadedImage("assets/icon/goldkey.png");
    addLoadedImage("assets/icon/tommygun.png");
}

function loadLevel() {
    mapPath  = levelsFile.mapPath;
    barPath = levelsFile.barPath;

    level = levelsFile.levels[0];
    addLoadedImage(barPath + level.bar);

    for (var i = 0; i < level.maps.length; i++) {
        var mapName = level.maps[i].name;
        addLoadedMap(mapName);
    }
}

function loadMap() {
    level.length = 0;
    for (var i = 0; i < level.maps.length; i++) {
        var mapTemp = level.maps[i];

        getLoadedMap(mapTemp.name).start = mapTemp.start;

        console.log("map start for " + mapTemp.name + "=" + getLoadedMap(mapTemp.name).start);

        var levelEnd = getLoadedMap(mapTemp.name).tiles.length + getLoadedMap(mapTemp.name).start;
        if (levelEnd > level.length) {
            level.length = levelEnd;
        }
    }

    console.log("Level length = " + level.length);



    map = new Map();
    map.initiate("test-map3");

    player.x = map.spawnX * scl;
    player.y = map.spawnY * scl + 1;
}

function loadBackgrounds() {
    backgroundPath = backgroundsFile.path;

    for (var i = 0; i < backgroundsFile.backgrounds.length; i++) {
        addLoadedImage(backgroundPath + backgroundsFile.backgrounds[i]);
    }
}

function loadTiles() {
    tilesPath = tilesFile.tilesFolder;

    for (t = 0; t < tilesFile.tiles.length; t++) {
        tiles.push(new Tile(tilesFile.tiles[t]));
    }
}

function move() {
    if (right && !left)
        player.moveRight();
    if (left && !right)
        player.moveLeft();
    if (up)
        player.jump();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW)
        left = true;
    else if (keyCode === RIGHT_ARROW)
        right = true;
    else if (keyCode === UP_ARROW) {
        player.jump();
        up = true;
    }
    else if (keyCode === DOWN_ARROW) {
        down = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW)
        left = false;
    else if (keyCode === RIGHT_ARROW)
        right = false;
    else if (keyCode === UP_ARROW)
        up = false;
    else if (keyCode === DOWN_ARROW)
        down = false;
}

function windowResized() {
    scaleCanvas();
    map.scale();
    player.scale();
    gui.scale();

    oldScl = scl;

    player.velocity.x = 0;
    player.velocity.y = 0;
    noUpdateTicks = 10;
}

function scaleCanvas() {
    scl = 1;
	while (windowWidth > canvasWidth * (scl + 1) && windowHeight > canvasHeight * (scl + 1) + borderHeight) {
		scl++;
	}
    if (canvas != null)
        resizeCanvas(canvasWidth * scl, canvasHeight * scl);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
