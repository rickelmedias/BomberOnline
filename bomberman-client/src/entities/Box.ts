import Phaser from "phaser";

export class Box extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, size: number = 50) {
    super(scene, x, y, "BombermanPlayfieldSheet", 404);
    scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setDisplaySize(size, size);
    this.setDepth(5);
  }

  getBoundingBox(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x, this.y, this.displayWidth, this.displayHeight);
  }
}
