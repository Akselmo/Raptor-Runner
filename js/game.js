//Clean up code when above is done
//Written by Akseli Lahtinen
//Hope you enjoy my spaghetti code ᕕ(ᐛ)ᕗ

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });


function preload() {
    game.load.spritesheet('raptor', 'sprites/raptorjacketspritesheet.png', 200, 92);
    game.load.image('ground', 'sprites/ground2.png');
    game.load.image('obstacle', 'sprites/obstacle.png');
    game.load.image('background', 'sprites/background.png');
    game.load.image('bullet', 'sprites/bullet.png');
    game.load.audio('music', 'sound/raptorrunner.ogg');
    game.load.spritesheet('enemy', 'sprites/enemy.png', 128, 64);
    game.load.audio('gun', 'sound/guntest.ogg');
    game.load.audio('explosion', 'sound/explosion.ogg');
    game.load.audio('jump', 'sound/jump.ogg');
    game.load.audio('crash', 'sound/crash.ogg');
    game.load.image('button', 'sprites/playbutton.png');
    game.load.image('menuscreen', 'sprites/menuscreen.png');
    game.load.image('btnLeft', 'sprites/arrow_left.png');
    game.load.image('btnUp', 'sprites/arrow_up.png');
    game.load.image('btnRight', 'sprites/arrow_right.png');
    game.load.image('btnFire', 'sprites/fire.png');
    game.load.image('btnToggleBtnOn', 'sprites/virtualpad_on.png');
    game.load.image('btnToggleBtnOff', 'sprites/virtualpad_off.png');

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.parentIsWindow = true;

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

}

//players and enemies
var player;
var playerHit = 0;
var bullets;
var bulletTime = 0;
var canFire = true;
var platform;
var obstacles;
var enemies;
var canSpawn = true;
var spawnTime = 0;
var canKillPlayer = true;
//keys
var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var keySpace;
//buttons
var btnGroup;
var btnToggleBtnOn;
var btnToggleBtnOff;
var btnUp;
var btnRight;
var btnLeft;
var btnFire;
var btnToggleBtnPressOn = false;
var btnToggleBtnPressOff = false;
var btnUpPress = false;
var btnRightPress = false;
var btnLeftPress = false;
var btnFirePress = false;
//text
var text;
var pausetext;
var style;
var gameovertext;
//Gamespeed var that gets higher gradually, affects also animation speed
var gamespeedDefault = 24;
var gamespeed;
var gamespeedMax = 300;
//sounds
var music;
var gunsound;
var explodesound;
var repeatsound = false;
var crashsound;
var GlobalGame;
var jumpsound;
var repeatjumpsound = false;
//Score
var score = 0;



function create() {

    //Add sky
    background = game.add.tileSprite(0, 0, game.width, game.height, 'background');

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
    ground.scale.setTo(2, 2);

    //Ground wont fall when player jumps on it
    ground.body.immovable = true;

    //Obstacles and their physics
    obstacles = game.add.group();
    obstacles = game.add.sprite(game.world.width + 50, game.world.height - 120, 'obstacle');
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
    player.body.setSize(90, 75, 100, 0);

    //bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 1);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    canFire = true;

    //enemies
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(5, 'enemy');
    enemies.setAll('anchor.x', 1);
    enemies.setAll('anchor.y', 1);
    enemies.setAll('outOfBoundsKill', true);
    enemies.setAll('checkWorldBounds', true);
    canSpawn = true;

    //Animations here
    player.animations.add('move', [0, 1, 2, 3], 12, true);
    player.animations.add('jump', [4, 5], 12, true);
    player.animations.add('fall', [6], 1, true);
    player.animations.add('dead', [7], 1, true);
    //Enemy animations are assigned elsewhere

    //debug text
    //style = { font: "14px Arial", fill: "#ff0044", align: "left" };
    //text = game.add.text(100, 200, "Gamespeed: " + gamespeed, style);
    //text.anchor.set(0.5,7.5);

    //Pause text
    var style1 = { font: "48px Silkscreen", fill: "#7d9adb", align: "center" }
    var style2 = { font: "24px Silkscreen", fill: "#7d9adb", align: "center" }
    var style3 = { font: "36px Silkscreen", fill: "#7d9adb", align: "center" }
    pausetext = game.add.text(game.world.centerX - 100, game.world.centerY, "", style1);
    pausetext.stroke = "#000000";
    pausetext.strokeThickness = 2;
    //Score
    scoretext = game.add.text(game.world.centerX + 200, game.world.centerY - 230, "Score: " + score, style2);
    scoretext.stroke = "#000000";
    scoretext.strokeThickness = 2;
    //gameover text
    gameovertext = game.add.text(game.world.centerX - 300, game.world.centerY, "", style3)
    gameovertext.stroke = "#000000";
    gameovertext.strokeThickness = 2;

    //Controls
    keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Music, probably not working correctly yet
    music = game.add.sound('music', true);
    music.play();
    music.volume = 0.3;
    music.loop = true;
    playerHit = false;

    //Gunsound
    gunsound = game.add.sound('gun', true);
    gunsound.volume = 0.4;

    //Explosion sound
    explodesound = game.add.sound('explosion', true);
    explodesound.volume = 0.3;
    explodesound.loop = false;

    //Crash sound
    crashsound = game.add.sound('crash', false);
    crashsound.volume = 0.3;
    crashsound.loop = false;
    repeatsound = true;

    //Jump sound
    jumpsound = game.add.sound('jump', false);
    jumpsound.volume = 0.3;
    jumpsound.loop = false;
    repeatjumpsound = true;


    //Pause function
    window.onkeydown = function() {
            //Keycode 27 is ESC
            if (game.input.keyboard.event.keyCode == 27) {
                game.paused = !game.paused;

                if (game.paused) {
                    pausetext.setText("Paused!");
                } else {
                    pausetext.setText("");
                }

            }
        }
        //Open mainmenu when the game is booted the first time
        //also load menu screen
    menuscreen = game.add.image(0, 0, 'menuscreen');
    mainmenu();


    //Mobile controls
    btnToggleBtnOn = game.add.button(0, 0, 'btnToggleBtnOn', btnToggleBtnOn, this, 2, 1, 0);
    btnToggleBtnOn.fixedToCamera = true;
    btnToggleBtnOn.events.onInputDown.add(function() { btnToggleBtnPressOn = true; });
    btnToggleBtnOn.events.onInputUp.add(function() { btnToggleBtnPressOn = false; });

    btnToggleBtnOff = game.add.button(0, 0, 'btnToggleBtnOff', btnToggleBtnOff, this, 2, 1, 0);
    btnToggleBtnOff.fixedToCamera = true;
    btnToggleBtnOff.events.onInputDown.add(function() { btnToggleBtnPressOff = true; });
    btnToggleBtnOff.events.onInputUp.add(function() { btnToggleBtnPressOff = false; });

    btnLeft = game.add.button(game.world.centerX - 310, 400, 'btnLeft', btnLeft, this, 2, 1, 0);
    btnLeft.fixedToCamera = true;
    btnLeft.events.onInputDown.add(function() { btnLeftPress = true; });
    btnLeft.events.onInputUp.add(function() { btnLeftPress = false; });


    btnRight = game.add.button(game.world.centerX - 190, 400, 'btnRight', btnRight, this, 2, 1, 0);
    btnRight.fixedToCamera = true;
    btnRight.events.onInputDown.add(function() { btnRightPress = true; });
    btnRight.events.onInputUp.add(function() { btnRightPress = false; });

    btnUp = game.add.button(game.world.centerX - 250, 400, 'btnUp', btnUp, this, 2, 1, 0);
    btnUp.fixedToCamera = true;
    btnUp.events.onInputDown.add(function() { btnUpPress = true; });
    btnUp.events.onInputUp.add(function() { btnUpPress = false; });

    btnFire = game.add.button(game.world.centerX + 250, 400, 'btnFire', btnFire, this, 2, 1, 0);
    btnFire.fixedToCamera = true;
    btnFire.events.onInputDown.add(function() { btnFirePress = true; });
    btnFire.events.onInputUp.add(function() { btnFirePress = false; });

    btnLeft.scale.setTo(0.5, 0.5);
    btnUp.scale.setTo(0.5, 0.5);
    btnRight.scale.setTo(0.5, 0.5);
    btnFire.scale.setTo(0.5, 0.5);
    btnToggleBtnOff.scale.setTo(0.7, 0.7);
    btnToggleBtnOn.scale.setTo(0.7, 0.7);

    btnGroup = game.add.group();
    btnGroup.add(btnLeft);
    btnGroup.add(btnRight);
    btnGroup.add(btnUp);
    btnGroup.add(btnFire);
    btnGroup.visible = false;
    btnToggleBtnOn.visible = true;
    btnToggleBtnOff.visible = false;


}


function update() {

    //Collide the player with platforms
    game.physics.arcade.collide(player, platform);

    // Reset velocity
    // Only background, ground and obstacles move!
    player.body.velocity.x = 0;

    if (btnToggleBtnPressOn) {
        btnGroup.visible = true;
        btnToggleBtnOn.visible = false;
        btnToggleBtnOff.visible = true;
    } else if (btnToggleBtnPressOff) {
        btnGroup.visible = false;
        btnToggleBtnOn.visible = true;
        btnToggleBtnOff.visible = false;
    }

    //up left right movement keys
    if ((keyUp.isDown || btnUpPress) && player.body.touching.down) {
        repeatjumpsound = true;
        player.body.velocity.y = -550;
        if (!jumpsound.isPlaying && repeatjumpsound == true) {
            jumpsound.play();
            repeatjumpsound = false;
        }
    } else if (keyRight.isDown || btnRightPress) {
        player.body.velocity.x = 250;
    } else if (keyLeft.isDown || btnLeftPress) {
        player.body.velocity.x = -250;
    }

    //Bullet firing
    if ((keySpace.isDown || btnFirePress) && canFire == true) {

        fireBullet();
    }

    //switch animations depending is player in air or not
    if (playerHit == false && !player.body.touching.down) {
        player.animations.play('jump');

    }
    //check if player is hit & in air, play falling animation if hit
    else if (playerHit == true && !player.body.touching.down) {
        player.animations.play("fall");
        canFire = false;
    }
    //check if player is hit & not in air, play falling animation if hit
    else if (playerHit == true && player.body.touching.down) {
        player.animations.play("dead");
        canFire = false;
    } else if (player.body.touching.down) {
        player.animations.play('move');
    }

    //move obstacles backwards * gamespeed
    obstacles.body.velocity.x = -gamespeed * 10;
    //reset obstacle if it's out of bounds
    //the random variable is for making the obstacle spawn in
    //different distances depending on how fast the game is
    var r = game.rnd.integerInRange(50 + gamespeed, 300 + gamespeed)
    if (obstacles.position.x < -50) {
        obstacles.reset(game.world.width + r, game.world.height - 120);
        obstacles.body.velocity.x = -gamespeed * 10;
        gamespeed++;
        score = score * 1 + 100;
    }

    //Check if player collides with obstacle
    if (game.physics.arcade.overlap(player, obstacles)) {
        playerHit = true;
    } else if (game.physics.arcade.overlap(player, enemies) && canKillPlayer == true) {
        playerHit = true;
    }

    if (playerHit == true) {
        //Stop repeating the sound over and over again!
        if (!crashsound.isPlaying && repeatsound == true) {
            crashsound.play();
            repeatsound = false;
        }
        restart();
    }

    //Enemy spawn
    //To avoid too many enemeis
    if (game.time.now > spawnTime && canSpawn == true) {
        enemy = enemies.getFirstExists(false);
        //Assign enemy players here
        enemy.animations.add('enemyFly', [0, 1, 2], 12, true);
        enemy.animations.play('enemyFly');
        if (enemy) {
            canKillPlayer = true;
            var spawnRandomizerW = game.rnd.integerInRange(50 + gamespeed, 300 + gamespeed);
            var spawnRandomizerH = game.rnd.integerInRange(100 + gamespeed, 400 + gamespeed);
            enemy.reset(game.world.width + spawnRandomizerW, game.world.height - spawnRandomizerH);
            enemy.body.velocity.x = -500 + gamespeed;
            spawnTime = game.time.now + 500 - gamespeed;
        }
    }

    // Gamespeed won't go over max speed
    if (gamespeed >= gamespeedMax) {
        gamespeed = gamespeedMax;
    }

    if (bullets.position.x > game.width) {
        resetBullet();
    }

    //When bullet hits enemy, do this
    game.physics.arcade.overlap(bullets, enemies, collisionHandler);

    //debugtext
    //text.setText("Gamespeed: " + gamespeed + "   " + playerHit + "  " + canKillPlayer + "  " + game.paused);
    scoretext.setText("Score: " + score);

    //Debug renderer
    //REMEMBER TO REMOVE (ʘᗩʘ')
    //render();

    background.tilePosition.x -= 0.01 * gamespeed;



}

//Main menu things
function mainmenu() {
    gamespeed = 0;
    canSpawn = false;
    button = game.add.button(game.world.centerX - 350, 400, 'button', startgame, this, 2, 1, 0);
    keyUp.enabled = false;
    keyDown.enabled = false;
    keyLeft.enabled = false;
    keyRight.enabled = false;
    keySpace.enabled = false;

}
//Mainmenu button function
function startgame() {


    canSpawn = true;
    gamespeed = gamespeedDefault;
    button.visible = false;
    keyUp.enabled = true;
    keyDown.enabled = true;
    keyLeft.enabled = true;
    keyRight.enabled = true;
    keySpace.enabled = true;
    menuscreen.visible = false;

}

//Debug renderer function that shows hitbox and other info
function render() {
    game.debug.bodyInfo(player, 32, 32);
    game.debug.body(player);
    game.debug.body(obstacles);
    game.debug.body(bullets);
}

function fireBullet() {
    //To avoid firing too many
    if (game.time.now > bulletTime && canFire == true) {
        bullet = bullets.getFirstExists(false);
        if (bullet) {
            bullet.reset(player.x + 198, player.y + 50);
            bullet.body.velocity.x = 600 + gamespeed;
            bulletTime = game.time.now + 200;
            gunsound.play();
        }
    }
}

//Kills bullets when out of bounds
function resetBullet(bullet) {
    bullet.kill();
}

//For now, it stops the movement and pressing any movement keys
//resets the player location and speed and score
function restart() {
    gamespeed = 0;
    keySpace.enabled = false;
    keyDown.enabled = false;
    keyLeft.enabled = false;
    keyRight.enabled = false;
    //stop player from moving
    player.body.velocity.x = 0;
    canSpawn = false;
    canFire = false;
    gameovertext.setText("GAME OVER! \n Press Up/Jump to try again!");
    if ((keyUp.isDown || btnUpPress) && player.body.touching.down) {
        //Reset everything
        player.reset(32, game.world.height - 150);
        obstacles.reset(game.world.width + 50, game.world.height - 120);
        //Kills all remaining enemies from the screen
        enemies.callAll('kill');
        gamespeed = gamespeedDefault;
        score = 0;
        //enable keys again!
        keySpace.enabled = true;
        keyDown.enabled = true;
        keyLeft.enabled = true;
        keyRight.enabled = true;
        playerHit = false;
        canFire = true;
        canSpawn = true;
        repeatsound = true;
        gameovertext.setText("");
    }
}

//Handler for bullets killing enemies + adding score
function collisionHandler(bullet, enemy) {
    canKillPlayer = false;
    var explode = enemy.animations.add('enemyExplode', [3], 12, false);
    enemy.animations.play("enemyExplode");
    explode.killOnComplete = true;
    bullet.kill();
    score = score * 1 + 50;
    explodesound.play();
}