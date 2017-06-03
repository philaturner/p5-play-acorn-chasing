//var direction = 90; //circle initial direction moving down
var player;
var particles;
var timer;
var MAX_PARTICLES = 10;
var PART_SIZE = 50;
var MARGIN = 40;
var START_OFFSET = 750;

function setup(){
  createCanvas(800,600);
  particles = new Group();

  for (var i = 0; i < MAX_PARTICLES; i++){
    var ang = random(360);
    var px = width/2 + START_OFFSET  * cos(radians(ang));
    var py = height/2+ START_OFFSET * sin(radians(ang));
    createParticle(3, px, py);
  }
  player = createSprite(random(0,width), random(0,height), 30, 100);
}

function draw(){
  background(61);
  //text at top of screen
  fill(255);
  textAlign(CENTER);
  text("Use your mouse to destroy the blocks", width/2, 20);

  //check to see if game overlap
  if (particles.length == 0) gameOverMessage();

  //check for sprites moving off screen and reposition
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  //checks for overlap and removes sprite
  for (var i = 0; i < particles.length; i++){
    if(player.overlap(particles[i]))
      particles[i].remove();
  }

  player.attractionPoint(.2, mouseX, mouseY);
  player.maxSpeed = 4;

  //draw all sprites
  drawSprites();
}

function createParticle(type, x, y){
  var p = createSprite(x, y, PART_SIZE, PART_SIZE);
  //var img  = loadImage("assets/particle"+floor(random(0,3))+".png");
  //a.addImage(img);
  p.setSpeed(4.5-(type/2), random(360));
  //a.rotationSpeed = .5;
  //a.debug = true;
  p.type = type;

  if(type == 2)
    p.scale = .6;
  if(type == 1)
    p.scale = .3;

  p.mass =  2 + p.scale;
  //a.setCollider("circle", 0, 0, 50);
  particles.add(p);
  return p;
}

function gameOverMessage(){
  //console.log('Game Over');
  fill(255);
  textAlign(CENTER);
  textSize(45);
  text("You destroyed all the blocks #WIN", width/2, height/2);
}
