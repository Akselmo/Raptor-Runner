var game = new Phaser.Game(600, 400, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });


function preload() {
  game.load.spritesheet('raptor', 'sprites/raptorspritesheet.png', 200, 92);
  game.load.image('ground', 'sprites/ground2.png');
  game.load.image('obstacle', 'sprites/obstacle.png');
  game.load.image('sky', 'sprites/sky_placeholder.png');
  game.load.audio('music', 'sound/tothenextdestination.mp3');
}

var player;
var platform;
var obstacles;
var cursors;
var text;
var style;
//Gamespeed var that gets higher gradually, affects also animation speed
var gamespeedDefault = 24;
var gamespeed;
var gamespeedMax = 300;
var music;
var GlobalGame;
var score = 0;


function create() {

  //Add sky
  game.add.tileSprite(0,0,600,600,'sky');

  //Physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  gamespeed = gamespeedDefault;

  //Group for ground sprite
  platform = game.add.group();

  //Physics for group
  platform.enableBody = true;

  //Create ground
  var ground = platform.create(0, game.world.height - 30, 'ground');

  //Scale ground
  ground.scale.setTo(2,2);

  //Ground wont fall when player jumps on it
  ground.body.immovable = true;

  //Obstacles and their physics
  obstacles = game.add.group();
  obstacles = game.add.sprite(game.world.width + 50,game.world.height - 120, 'obstacle');
  game.physics.arcade.enable(obstacles);
  obstacles.enableBody = true;
  obstacles.physicsBodyType = Phaser.Physics.ARCADE;
  obstacles.body.gravity.y = 0;
  obstacles.body.collideWorldBounds = false;

  //Player
  player = game.add.sprite(32, game.world.height - 150, 'raptor');

  //Physics for player
  game.physics.arcade.enable(player);

  //Player physics properties
  player.body.bounce.y = 0;
  player.body.gravity.y = 500;
  player.body.collideWorldBounds = true;
  //Player hitbox
  player.body.setSize(90,75,100,0);

  //Animations here
  player.animations.add('move',[0,1,2,3],12, true);
  player.animations.add('jump',[4,5],12,true);

  //debug text
  style = { font: "14px Arial", fill: "#ff0044", align: "left" };
  text = game.add.text(100, 200, "Gamespeed: " + gamespeed, style);
  text.anchor.set(0.5,7.5);

  //Score
  scoretext = game.add.text(100,200, "Score: " + score, style );
  scoretext.anchor.set(-3,7.5);
  //Controls
  cursors = game.input.keyboard.createCursorKeys();

  //Music, probably not working correctly yet
  music = game.add.sound('music');
  music.play();
  music.volume = 0.1;
  music.loop = true;

}

function update() {


  //Collide the player with platforms
  game.physics.arcade.collide(player, platform);

  // Reset velocity
  // Only background, ground and obstacles move!
  player.body.velocity.x = 0;

  //up left right movement keys
  if (cursors.up.isDown  && player.body.touching.down)
  {
    player.body.velocity.y = -500;
  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 250;
  }
  else if (cursors.left.isDown)
  {
    player.body.velocity.x = -250;
  }

  //switch animations depending is player in air or not
  if (!player.body.touching.down)
  {
    player.animations.play('jump');
  }
  else
  {
    player.animations.play('move');
  }

  obstacles.body.velocity.x = -gamespeed*10;
  //reset obstacle if it's out of bounds
  //the random variable is for making the obstacle spawn in
  //different distances depending on how fast the game is
  var r = game.rnd.integerInRange(50+gamespeed,300+gamespeed)
  if (obstacles.position.x < -50)
  {

    obstacles.reset(game.world.width+r,game.world.height - 120);
    obstacles.body.velocity.x = -gamespeed*10;
    gamespeed++;
    score = score*1 + 100;

  }
  else if (game.physics.arcade.overlap(player,obstacles))
  {

    restart();
  }
  // Gamespeed won't go over max speed
  if(gamespeed >= gamespeedMax)
  {
    gamespeed = gamespeedMax;
  }
  //debugtext
  text.setText("Gamespeed: " + gamespeed + "");
  scoretext.setText("Score: " + score );
  //Debug renderer
  //REMEMBER TO REMOVE (ʘᗩʘ')
  //render();
}

//Main menu things
function mainmenu()
{

}

//Debug renderer function that shows hitbox and other info
function render()
{
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(obstacles);
}

//For now, it stops the movement and pressing any movement keys
//resets the player location and speed and score
function restart()
{
  gamespeed = 0;
  text.setText("You crashed! Gamespeed: " + gamespeed + "");
  if (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown)
  {
    player.reset(32, game.world.height - 150);
    obstacles.reset(game.world.width+50,game.world.height - 120);
    gamespeed = gamespeedDefault;
    score = 0;

  }


}
