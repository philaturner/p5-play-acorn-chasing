var player;
var acorns;
var spanners;
var timer = 0;
var theTimer;
var health = 100;
var dead = false;

//Global variables
var MAX_ACORNS = 15;
var MAX_SPANNERS = 5;
var MARGIN = 40;
var START_OFFSET = 750;

function setup(){
  createCanvas(800,600);
  acorns = new Group();
  spanners = new Group(); //TODO Build into obsticles with trees, add player health and death

  for (var i = 0; i < MAX_ACORNS; i++){
    var ang = random(360);
    var px = width/2 + START_OFFSET  * cos(radians(ang));
    var py = height/2+ START_OFFSET * sin(radians(ang));
    createAcorn(3, px, py);
  }

  for (var i = 0; i < MAX_SPANNERS; i++){
    var ang = random(360);
    var px = width/2 + START_OFFSET  * cos(radians(ang));
    var py = height/2+ START_OFFSET * sin(radians(ang));
    createSpanner(3, px, py);
  }

  player = createSprite(random(0,width), random(0,height));
  var img  = loadImage("assets/squizza_sprite.png");
  player.addImage(img);
  player.scale = .6;
  theTimer = setInterval(updateTimer, 500);
}

function draw(){
  background(61);

  //healthbar
  rect(30, 20, 150, 30);
  fill(255,0,0);
  rect(30, 20, map(150,0,150,0,health), 30);

  //text at top of screen
  fill(255);
  textAlign(CENTER);
  text("Mouse to move - Collect acorns & avoid spanners", width/2, 20);
  text("Health", 45, 65);
  text(timer + ' seconds', width/2, height-20);

  //check to see if gameover
  if (acorns.length == 0) gameOverMessage();
  if (health == 0){
    dead = true;
    //remove all sprites
    for(var i=0; i<allSprites.length; i++) {
      var s = allSprites[i];
      s.remove();
      gameOverMessage();
    }
  }

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

  for (var i = 0; i < spanners.length; i++){
    if(player.overlap(spanners[i]))
      if (health > 0) health -= 1;
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

  //TODO Build other acorn sprite types small or different??
  if(type == 3)
    a.scale = .4;
  if(type == 2)
    a.scale = .6;
  if(type == 1)
    a.scale = .3;

  a.mass =  2 + a.scale;

  //a.setCollider("circle", 0, 0, 50); //TODO Add chance not to consume but to collide and push away acorn
  acorns.add(a);
  return a;
}

function createSpanner(type, x, y){
  var s = createSprite(x, y);
  var img  = loadImage("assets/spanner.png");
  s.addImage(img);
  s.setSpeed(6.5-(type/2), random(360));
  s.rotationSpeed = 5;
  //s.debug = true;
  s.type = type;

  //TODO
  if(type == 3)
    s.scale = .3;
  if(type == 2)
    s.scale = .6;
  if(type == 1)
    s.scale = .3;

  s.mass =  3 + s.scale;

  spanners.add(s);
  return s;
}

function gameOverMessage(){
  //console.log('Game Over');
  if (!dead){
    clearInterval(theTimer);
    fill(255, 153, 0);
    textAlign(CENTER);
    textSize(45);
    text("You did good! #WIN", width/2, height/2);
  } else {
    clearInterval(theTimer);
    fill(255, 10, 0);
    textAlign(CENTER);
    textSize(45);
    text("Spanners Hurt #RIP", width/2, height/2);
  }
}

function updateTimer(){
  timer += 1;
}
