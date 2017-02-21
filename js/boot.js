var bootGame = function(game){};

bootGame.prototype.create = function(){
	console.log("Booting game");

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.state.start("loadGame");
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	// game.world.setBounds(0, -651, 900, 1131);

	game.stage.backgroundColor = "#007f5f";


	//fps
	game.time.advancedTiming = true;

	//HACK TO PRELOAD A CUSTOM FONT
	this.game.add.text(game.world.centerX,game.world.centerY, "LOADING", {font:"1px Silkscreen", fill:"#FFFFFF"});
}

bootGame.prototype.preload = function(){
}
