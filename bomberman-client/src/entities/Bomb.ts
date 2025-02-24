export class Bomb extends Phaser.GameObjects.Sprite {
  public exploded: boolean = false;
  private timer: number;
  private startTime: number;

  constructor(scene: Phaser.Scene, x: number, y: number, timer: number) {
    super(scene, x, y, 'bombermanSheet');
    scene.add.existing(this);

    this.timer = timer;
    this.startTime = scene.time.now;
    console.log(`Bomb placed at (${x}, ${y}) with timer ${timer}`);

    const scaleFactor = 50 / 16;
    this.setScale(scaleFactor);

    this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.setOrigin(0.5, 0.5);
    this.play("bomb_anim");
  }

  update(time: number, delta: number) {
    if (!this.exploded && time - this.startTime >= this.timer) {
      console.log("Bomb: timer reached, exploding now");
      this.explode();
    }
  }

  explode() {
    this.exploded = true;
    this.scene.events.emit("bomb_exploded", this.x, this.y);
    this.destroy();
  }
}
