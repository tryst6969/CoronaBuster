// Meeting 11
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("over-scene");
  }

  init(data) {
    this.replayButton = undefined;
    this.score = data.score; // Fill in the score property with the score value sent from the corona buster scene

  }

  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("gameover", "images/gameover.png");
    this.load.image("replay-button", "images/replay.png");
  }

  create() {
    this.add.image(200, 320, "background");
    this.add.image(200, 200, "gameover");
    this.add.text(100, 300, "Score: " + this.score, {
      fontSize: "32px",
      fill: "black",
    });

    this.replayButton = this.add.image(200, 400, 'replay-button').setInteractive().setScale(0.5);
    this.replayButton.once("pointerup", () => {
        this.scene.start("corona-buster-scene"); 
    },this);
  }
}