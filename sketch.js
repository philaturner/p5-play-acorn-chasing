//var direction = 90; //circle initial direction moving down
var player;
var particles;
var timer = 0;
var theTimer;
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
  text("Use your mouse to move Squizza", width/2, 20);
  text(timer + ' seconds', width/2, height-20);
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
  var img  = loadImage("assets/acorn.png");
  p.addImage(img);
  p.setSpeed(4.5-(type/2), random(360));
  p.rotationSpeed = .5;
  //a.debug = true;
  p.type = type;

  if(type == 3)
    p.scale = .05;
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
  clearInterval(theTimer);
  fill(255, 153, 0);
  textAlign(CENTER);
  textSize(45);
  text("You did good! #WIN", width/2, height/2);
}

function updateTimer(){
  timer += 1;
}
