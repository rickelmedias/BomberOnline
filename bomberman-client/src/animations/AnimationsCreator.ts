import Phaser from "phaser";

export function AnimationsCreator(scene: Phaser.Scene) {
  scene.anims.create({
    key: "bomb_anim",
    frames: scene.anims.generateFrameNumbers("bombermanSheet", { start: 42, end: 44 }),
    frameRate: 8,
    repeat: -1,
  });
  
  scene.anims.create({
    key: "player_walk_down_anim",
    frames: scene.anims.generateFrameNumbers("bombermanSheet", { start: 3, end: 5 }),
    frameRate: 8,
    repeat: 0,
  });

  scene.anims.create({
    key: "player_walk_left_anim",
    frames: scene.anims.generateFrameNumbers("bombermanSheet", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: 0,
  });

  scene.anims.create({
    key: "player_walk_right_anim",
    frames: scene.anims.generateFrameNumbers("bombermanSheet", { start: 14, end: 16 }),
    frameRate: 8,
    repeat: 0,
  });

  scene.anims.create({
    key: "player_walk_up_anim",
    frames: scene.anims.generateFrameNumbers("bombermanSheet", { start: 17, end: 19 }),
    frameRate: 8,
    repeat: 0,
  });
}