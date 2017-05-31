//var direction = 90; //circle initial direction moving down
var player;
var blobs = [];
var TOTAL_BLOBS = 10;

function setup() {
  createCanvas(800,600);
  for (var i = 0; i < TOTAL_BLOBS; i++){
    blobs[i] = createSprite(random(0,width), random(0,height), 10, 10);
    blobs[i].setSpeed(3, random(0,10));
  }
  player = createSprite(random(0,width), random(0,height), 30, 125);
}

function draw() {
  background(61);

  //checks for overlap and removes sprite
  for (var i = 0; i < blobs.length; i++){
    if(player.overlap(blobs[i]))
      blobs[i].remove();
  }

  //aside of setting the velocity directly you can move a sprite
  //by providing a speed and an angle
  //direction += 2;

  for (var i = 0; i < blobs.length; i++){
    //speed, angle
    blobs[i].setSpeed(3)
    if(blobs[i].x < 0 || blobs[i].x > width)
      blobs[i].setDirection(45);
  }

  //or by applying a force toward a point
  //force (acceleration), pointx, pointy
  player.attractionPoint(.2, mouseX, mouseY);

  //since the force keeps incrementing the speed you can
  //set a limit to it with maxSpeed
  player.maxSpeed = 4;

  //draw all sprites
  drawSprites();

}
