//Things to do: Main menu, shooting, flying enemies, background, ground anim
//Clean up code when above is done
//Written by Akseli Lahtinen
//Hope you enjoy my spaghetti code ᕕ(ᐛ)ᕗ

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
  game.load.spritesheet('raptor', 'sprites/raptorjacketspritesheet.png', 200, 92);
  game.load.image('ground', 'sprites/ground2.png');
  game.load.image('obstacle', 'sprites/obstacle.png');
  game.load.image('sky', 'sprites/sky_placeholder.png');
  game.load.image('bullet', 'sprites/bullet.png');
  game.load.audio('music', 'sound/tothenextdestination.mp3');
  game.load.image('enemy', 'sprites/enemy.png');
}

var player;
var bullets;
var bulletTime = 0;
var canFire = true;
var platform;
var obstacles;
var enemies;
var canSpawn = true;
var spawnTime = 0;
var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var keySpace;
var text;
var style;
//Gamespeed var that gets higher gradually, affects also animation speed
var gamespeedDefault = 24;
var gamespeed;
var gamespeedMax = 300;
var music;
var GlobalGame;
var score = 0;
var playerHit = 0;

function create() {

  //Add sky
  game.add.tileSprite(0,0,game.width,game.height,'sky');

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

  //bullets
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30,'bullet');
  bullets.setAll('anchor.x', 1);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds',true);
  canFire = true;

  //enemies
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(5,'enemy');
  enemies.setAll('anchor.x', 1);
  enemies.setAll('anchor.y', 1);
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds',true);
  canSpawn = true;

  //Animations here
  player.animations.add('move',[0,1,2,3],12, true);
  player.animations.add('jump',[4,5],12,true);
  player.animations.add('fall',[6],1,true);
  player.animations.add('dead',[7],1,true);

  //debug text
  style = { font: "14px Arial", fill: "#ff0044", align: "left" };
  text = game.add.text(100, 200, "Gamespeed: " + gamespeed, style);
  text.anchor.set(0.5,7.5);

  //Score
  scoretext = game.add.text(100,200, "Score: " + score, style );
  scoretext.anchor.set(-3,7.5);

  //Controls
  keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //Music, probably not working correctly yet
  music = game.add.sound('music', true);
  music.play();
  music.volume = 0.1;
  music.loop = true;
  playerHit = false;
}

function update() {

  //Collide the player with platforms
  game.physics.arcade.collide(player, platform);

  // Reset velocity
  // Only background, ground and obstacles move!
  player.body.velocity.x = 0;

  //up left right movement keys
  if (keyUp.isDown  && player.body.touching.down)
  {
    player.body.velocity.y = -550;
  }
  else if (keyRight.isDown)
  {
    player.body.velocity.x = 250;
  }
  else if (keyLeft.isDown)
  {
    player.body.velocity.x = -250;
  }

  //Bullet firing
  if (keySpace.isDown && canFire == true)
  {
    fireBullet();
  }

  //switch animations depending is player in air or not
  if (playerHit == false && !player.body.touching.down)
  {
    player.animations.play('jump');
  }
  //check if player is hit & in air, play falling animation if hit
  else if (playerHit == true && !player.body.touching.down)
  {
    player.animations.play("fall");
    canFire = false;
  }
  //check if player is hit & not in air, play falling animation if hit
  else if (playerHit == true && player.body.touching.down)
  {
    player.animations.play("dead");
    canFire = false;
  }
  else if (player.body.touching.down)
  {
    player.animations.play('move');
  }

  //move obstacles backwards * gamespeed
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

  //Check if player collides with obstacle
  if (game.physics.arcade.overlap(player,obstacles))
  {
    playerHit = true;
  }
  else if (game.physics.arcade.overlap(player,enemies))
  {
    playerHit = true;
  }

  if (playerHit == true)
  {
    restart();
  }

  //Enemy spawn
  //To avoid too many enemeis
  if (game.time.now > spawnTime && canSpawn == true)
  {
    enemy = enemies.getFirstExists(false);
    if (enemy)
      {
          var spawnRandomizerW = game.rnd.integerInRange(50+gamespeed,300+gamespeed);
          var spawnRandomizerH = game.rnd.integerInRange(100+gamespeed,400+gamespeed);
          enemy.reset(game.world.width + spawnRandomizerW, game.world.height - spawnRandomizerH);
          enemy.body.velocity.x = -500+gamespeed;
          spawnTime = game.time.now + 500 - gamespeed;
      }
  }

  // Gamespeed won't go over max speed
  if(gamespeed >= gamespeedMax)
  {
    gamespeed = gamespeedMax;
  }

  if (bullets.position.x > game.width)
  {
    resetBullet();
  }

  //When bullet hits enemy, do this
  game.physics.arcade.overlap(bullets, enemies, collisionHandler);

  //debugtext
  text.setText("Gamespeed: " + gamespeed + "   " + playerHit + "  " + canFire);
  scoretext.setText("Score: " + score );
  //Debug renderer
  //REMEMBER TO REMOVE (ʘᗩʘ')
  //render();
}

//TO DO: Main menu things
function mainmenu()
{

}

//Debug renderer function that shows hitbox and other info
function render()
{
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(obstacles);
  game.debug.body(bullets);
}

function fireBullet ()
{
  //To avoid firing too many
  if (game.time.now > bulletTime && canFire == true)
  {
    bullet = bullets.getFirstExists(false);
    if (bullet)
      {
          bullet.reset(player.x + 198, player.y + 50);
          bullet.body.velocity.x = 600+gamespeed;
          bulletTime = game.time.now + 200;
      }
    }
}

//Kills bullets when out of bounds
function resetBullet (bullet)
{
  bullet.kill();
}

//For now, it stops the movement and pressing any movement keys
//resets the player location and speed and score
function restart()
{
  gamespeed = 0;
  keyUp.enabled = false;
  keyDown.enabled = false;
  keyLeft.enabled = false;
  keyRight.enabled = false;
  //stop player from moving
  player.body.velocity.x = 0;
  canSpawn = false;
  canFire = false;
  if (keySpace.isDown && player.body.touching.down)
  {
    //Reset everything
    player.reset(32, game.world.height - 150);
    obstacles.reset(game.world.width+50,game.world.height - 120);
    //Kills all remaining enemies from the screen
    enemies.callAll('kill');
    gamespeed = gamespeedDefault;
    score = 0;
    //enable keys again!
    keyUp.enabled = true;
    keyDown.enabled = true;
    keyLeft.enabled = true;
    keyRight.enabled = true;
    playerHit = false;
    canFire = true;
    canSpawn = true;
  }
}

//Handler for bullets killing enemies + adding score
function collisionHandler (bullet, enemy)
{
  bullet.kill();
  enemy.kill();
  score = score*1 + 50;
}
