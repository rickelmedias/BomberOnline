export class Player extends Phaser.GameObjects.Sprite {
  public speed: number = 50;

  private idleFrameMapping: { [key: string]: number } = {
    player_walk_down_anim: 4,
    player_walk_left_anim: 1,
    player_walk_right_anim: 15,
    player_walk_up_anim: 18,
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bombermanSheet");
    scene.add.existing(this);

    const scaleFactor = 50 / 16;
    this.setScale(scaleFactor);

    this.setOrigin(0, 0);

    this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.setFrame(this.idleFrameMapping["player_walk_down_anim"]);
    this.setDepth(17);

    this.on("animationcomplete", (anim: Phaser.Animations.Animation) => {
      const idleFrame = this.idleFrameMapping[anim.key];
      if (idleFrame !== undefined) {
        this.setFrame(idleFrame);
      }
    });
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}
