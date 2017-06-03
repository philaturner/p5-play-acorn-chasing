//var direction = 90; //circle initial direction moving down
var player;
var acorns;
var trees;
var timer = 0;
var theTimer;
var MAX_ACORNS = 15;
var MARGIN = 40;
var START_OFFSET = 750;

function setup(){
  createCanvas(800,600);
  acorns = new Group();
  trees= new Group();

  for (var i = 0; i < MAX_ACORNS; i++){
    var ang = random(360);
    var px = width/2 + START_OFFSET  * cos(radians(ang));
    var py = height/2+ START_OFFSET * sin(radians(ang));
    createAcorn(3, px, py);
  }
  player = createSprite(random(0,width), random(0,height));
  var img  = loadImage("assets/squizza_sprite.png");
  player.addImage(img);
  player.scale = .6;
  theTimer = setInterval(updateTimer, 500);
}

function draw(){
  background(61);

  //text at top of screen
  fill(255);
  textAlign(CENTER);
  text("Move your mouse to move Squizza", width/2, 20);
  text(timer + ' seconds', width/2, height-20);
  //check to see if game overlap
  if (acorns.length == 0) gameOverMessage();

  //check for sprites moving off screen and reposition
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  //checks for overlap and removes sprite
  for (var i = 0; i < acorns.length; i++){
    if(player.overlap(acorns[i]))
      acorns[i].remove();
  }

  player.attractionPoint(.2, mouseX, mouseY);
  player.maxSpeed = 4;

  //draw all sprites
  drawSprites();
}

function createAcorn(type, x, y){
  var a = createSprite(x, y);
  var img  = loadImage("assets/acorn.png");
  a.addImage(img);
  a.setSpeed(4.5-(type/2), random(360));
  a.rotationSpeed = .5;
  //a.debug = true;
  a.type = type;

  if(type == 3)
    a.scale = .04;
  if(type == 2)
    a.scale = .6;
  if(type == 1)
    a.scale = .3;

  a.mass =  2 + a.scale;
  //a.setCollider("circle", 0, 0, 50);
  acorns.add(a);
  return a;
}

function gameOverMessage(){
  //console.log('Game Over');
  clearInterval(theTimer);
  fill(255, 153, 0);
  textAlign(CENTER);
  textSize(45);
  text("You did good! #WIN", width/2, height/2);
}

function updateTimer(){
  timer += 1;
}
