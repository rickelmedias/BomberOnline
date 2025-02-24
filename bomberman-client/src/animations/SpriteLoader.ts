import Phaser from "phaser";

export function SpriteLoader(scene: Phaser.Scene) {
  scene.load.spritesheet("bombermanSheet", "assets/BombermanSheet.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  
  scene.load.spritesheet("BombermanPlayfieldSheet", "assets/BombermanPlayfieldSheet.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
}
