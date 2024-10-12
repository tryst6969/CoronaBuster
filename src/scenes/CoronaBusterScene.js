import Phaser from "phaser";
import FallingObject from "./ui/FallingObject";
import Laser from "./ui/Laser";

export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }
  init() {
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    // Meeting 8
    this.player = undefined;
    this.speed = 100;
    this.cursors = undefined;
    // Meeting 9
    this.enemies = undefined;
    this.enemySpeed = 50;
    // Meeting 10
    this.lasers = undefined;
    this.lastFired = 10;
    // Meeting 11
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel = undefined
    this.lifescore = 3;
  }

  preload() {

    this.load.image("background", "images/bg_layer1.png");
    this.load.image('cloud', 'images/cloud.png');
    this.load.image('left-btn', 'images/left-btn.png');
    this.load.image('right-btn', 'images/right-btn.png');
    this.load.image('shoot', 'images/shoot-btn.png');
    // Meeting 8
    this.load.spritesheet("player", "images/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    });
    // Meeting 9
    this.load.image('enemy', 'images/enemy.png');
    // Meeting 10
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

  }
  create() {

    const gameWidht = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidht, gameHeight, "background");
    this.createButton();
    
    this.clouds = this.physics.add.group({
        key: "cloud",
        repeat: 10,
      });
    Phaser.Actions.RandomRectangle(this.clouds.getChildren(), this.physics.world.bounds);
    // Meeting 8
    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys()
    // Meeting 9

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,  //-----> the number of enemies in one group
      runChildUpdate: true,
    });

    // Meeting 11
    this.scoreLabel = this.add.text(10, 10, "Score", {
      fontSize: "16px",
      fill: "black",
      backgroundColor: "white",
    }).setDepth(1);
    // Meeting 11
    this.lifeLabel = this.add.text(10, 40, "Life", {
      fontSize: "16px",
      fill: "black",
      backgroundColor: "white",
    }).setDepth(1);
    // Meeting 11
    this.physics.add.overlap(
      this.player, 
      this.enemies, 
      this.decreaseLife, 
      null,
      this
   );


  }
  update(time) {
    this.clouds.children.iterate((child) => {
        child.setVelocityY(20); //----------> move down
        if (child.y > this.scale.height) { //---------->  if it crosses the lower bound
          child.x = Phaser.Math.Between(10, 400); //----------> the cloud position is moved to the top of the layout
          child.y = 0;
        }
      });
      // Meeting 8
      this.movePlayer(this.player, time); 
      // Meeting 9
      this.time.addEvent({
        delay: Phaser.Math.Between(1000, 5000), //--------> Delay random range 1-5 seconds
        callback: this.spawnEnemy,
        callbackScope: this,        //--------------------> Calling a method named spawnEnemy
        loop: true,
      });
      // Meeting 10
      this.lasers = this.physics.add.group({
        classType: Laser,
        maxSize: 10,
        runChildUpdate: true,
      });
      // Meeting 10 Lazer Overlap
      this.physics.add.overlap(this.lasers, this.enemies, this.hitEnemy, null, this)
      
      // Meeting 11
      this.scoreLabel.setText("Score : " + this.score);
      this.lifeLabel.setText("Life : " + this.lifescore);
      
  }

  createButton(){
    this.input.addPointer(3)    
    let shoot = this.add.image(320,550, 'shoot').setInteractive().setDepth(0.5).setAlpha(0.8)   
    let nav_left = this.add.image(50,550, 'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8)
    let nav_right = this.add.image(nav_left.x + nav_left.displayWidth+20, 550,'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

    nav_left.on(
      "pointerdown",
      () => {       //---------> When the pointer is up (clicked) then the nav left property will be true
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {      //----------> When the pointer is out (not clicked) then the nav left property will be false
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        this.shoot = false;
      },
      this
    );
}
  // Meeting 8
  movePlayer(player, time) {
    // Meeting 8 adjustment
    if (this.cursors.left.isDown || this.nav_left) {
      player.setVelocityX(this.speed * -1);
      player.anims.play("left", true);
      player.setFlipX(false);
    //Meeting 8 adjustment
    } else if (this.nav_right || this.cursors.right.isDown) {
      player.setVelocityX(this.speed);
      player.anims.play("right", true);
      player.setFlipX(true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
    }
    // Meeting 8 adjustment
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(this.speed * -1)
      this.player.setFlipX(false)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed)
      this.player.setFlipX(true)
    } else {
      this.player.setVelocityY(0)
      
    }
    // Meeting 10
    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 1;
      }
    }
  }
  // Meeting 8
  createPlayer(){
      const player = this.physics.add.sprite(200, 450,'player')
      player.setCollideWorldBounds(true)
      // Meeting 8
      this.anims.create({
        key: "turn",
        frames: [
          {
            key: "player",
            frame: 0,
          },
        ],
      });
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", {
          start: 1,
          end: 2,
        }),
      });
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", {
          start: 1,
          end: 2,
        }),
      });
      return player;
}

//Meeting 9
spawnEnemy() {
  const config = {
     speed: 30,       //-----------> Set the speed and rotation size of the enemy
     rotation: -0.01
  };
  const enemy = this.enemies.get(0, 0, 'enemy', config);
  const positionX = Phaser.Math.Between(50, 350); //-----> Take random numbers from 50-350
  if (enemy) {
     enemy.spawn(positionX);   //--------------> Calling the spawn method with the x-position value parameter
  }
}
// Meeting 10
hitEnemy(laser, enemy) {
  laser.die()           //--------> Lasers and enemies are destroyed 
  enemy.die()
  // Meeting 11
  this.score += 10;

}

decreaseLife(player, enemy) {
  enemy.die();
  this.lifescore--;
  if (this.lifescore == 2) {
    player.setTint(0xff0000);
  } else if (this.lifescore == 1) {
    player.setTint(0xff0000).setAlpha(0.2);
  } else if (this.lifescore == 0) {
    this.scene.start("over-scene", { score: this.score });
  }
}

  

}