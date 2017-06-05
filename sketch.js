var player;
var acorns;
var spanners;
var hurty;
var timer = 0;
var theTimer;
var score;
var acornCounter = 0;
var health = 100;
var dead = false;
var won = false;

//Global variables
var MAX_ACORNS = 15;
var MAX_SPANNERS = 5;
var MARGIN = 30;
var START_OFFSET = 750;
var HEALTH_LOSS = 1;
var HIGH_SCORE_LIMIT = 10;

//firebase stuff
var database;
var submitButton;
var nameInput;
var submitP;
var highScores =[];

function preload(){
  //preload animations
  //hurty = loadAnimation("assets/squizza_hurting0003.png");

}

function setup(){
  var canvas = createCanvas(800,600);
  canvas.parent('canvas-container');

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDj7uIuvn-KWGM4q2GleJyxipkHpZfU9B0",
    authDomain: "chasing-acorns.firebaseapp.com",
    databaseURL: "https://chasing-acorns.firebaseio.com",
    projectId: "chasing-acorns",
    storageBucket: "chasing-acorns.appspot.com",
    messagingSenderId: "88693760599"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  console.log(database);

  //load data and highscores
  var ref = database.ref("scores");
  ref.on("value", gotData, errData);

  //create buttons etc and disable from default
  submitP = createP('Submit your score if you win the game!')
  submitP.parent('content');
  nameInput = createInput('Enter name');
  nameInput.parent('content');
  submitButton = createButton('Submit');
  submitButton.parent('content');
  submitButton.attribute('disabled', true);
  submitButton.mousePressed(submitScore);


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

  player = createSprite(width/2, height/2);
  var img  = loadImage("assets/squizza_sprite.png");
  player.addImage(img);
  player.scale = .6;
  player.position.x = width/2;
  player.position.y = height/2;
  //player.addAnimation("normal", "assets/squizza_sprite.png", "assets/squizza_sprite.png");
  //player.addAnimation("hurting", "assets/squizza_hurting0001.png", "assets/squizza_hurting0002.png", "assets/squizza_hurting0003.png");
  // acornCounter == MAX_ACORNS;
  // console.log (acornCounter);
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
  text("Health", 47, 65);
  textSize(18);
  text("Acorns: " + acorns.length, width -100, 42);
  text(timer + ' seconds', width/2, height-20);

  //check to see if gameover
  if (acorns.length == 0) gameOverMessage();
  if (health == 0){
    dead = true;
    //remove all sprites
    for(var i=0; i<allSprites.length; i++) {
      var s = allSprites[i];
      s.remove();
    }
  }

  //check for sprites moving off screen and reposition
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
      acornCounter = 0;
  }

  //checks for overlap and removes sprite
  for (var i = 0; i < acorns.length; i++){
    if(player.overlap(acorns[i]))
      acorns[i].remove();
      acornCounter --;
  }

  //for (var i = 0; i < spanners.length; i++){
    if(player.overlap(spanners)){
      //hurty.play();
        if (health > 0) {
          health -= HEALTH_LOSS;
        }
    }
    else {
      //hurty.stop();
      //TODO add better animation stuff
    }
  //}

  //Old movement
  //player.attractionPoint(.2, mouseX, mouseY);
  //player.maxSpeed = 4;

  //new movementment
  player.velocity.x = (mouseX-player.position.x)/10;
  player.velocity.y = (mouseY-player.position.y)/10;

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
  score = calcScore();
  if (!dead){
    clearInterval(theTimer);
    fill(255, 153, 0);
    textAlign(CENTER);
    textSize(45);
    text("You did good! #WIN", width/2, height/2);
    clearSprites();
    showScoreName();
  } else {
    clearInterval(theTimer);
    fill(255, 10, 0);
    textAlign(CENTER);
    textSize(45);
    text("Spanners Hurt #RIP", width/2, height/2);
  }
  textAlign(CENTER);
  textSize(22);
  fill(255);
  text("Score: " + score, width/2, height/2+40);
}

function updateTimer(){
  timer += 0.5;
}

function clearSprites(){
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    s.remove();
  }
}

function calcScore(){
  if (dead) return 0;
  return (health * 10) - (timer * 4);
}

function showScoreName(){
  submitButton.removeAttribute('disabled');
}

function submitScore(){
  submitButton.attribute('hidden',true)
  nameInput.attribute('hidden', true)
  createP('Thanks for submitting your score').parent('content');
  var data = {
    name: nameInput.value(),
    score: score
  }
  var scores = database.ref('scores').push(data);
  //submitP.html('Score has been submited, thanks!')
  //populateHighscores();
}

function gotData(data) {
  highScores = [];
  var tempScores = data.val();

  // Grab the keys to iterate over the object
  var keys = Object.keys(tempScores);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var name = tempScores[key].name;
    var score = tempScores[key].score;
    //console.log(name,score);
    highScores.push([name, score]);
  }
  highScores.sort(compareSecondColumn);

  function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
  }
  populateHighscores();
}

function populateHighscores(){
  //clear old scores
  var scoreClass = selectAll('.scores_list');
  for (var i = 0; i < scoreClass.length; i++){
    scoreClass[i].remove();
  }

  //gen new scores
  for (i = 0; i < HIGH_SCORE_LIMIT; i++){
    var li = createElement('li', highScores[i][0] + ': ' + highScores[i][1]);
    li.class('scores_list');
    li.parent('scorelist');
  }
}

function errData(err){
  console.log(err);
}
