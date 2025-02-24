// src/managers/LevelBuilder.ts
import Phaser from "phaser";
import { Block } from "../entities/Block";
import { Box } from "../entities/Box";

export class LevelBuilder {
  constructor(private scene: Phaser.Scene) {}

  public buildLevel(
    scenario: number[][],
    gridSize: number,
    blocksGroup: Phaser.GameObjects.Group,
    boxesGroup: Phaser.GameObjects.Group
  ): void {
    scenario.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * gridSize;
        const y = rowIndex * gridSize;

        if ([0, 1, 2, 8, 9].includes(cell)) {
          this.scene.add
            .sprite(x + gridSize / 2, y + gridSize / 2, "BombermanPlayfieldSheet", 52)
            .setDisplaySize(gridSize, gridSize)
            .setDepth(0);
        }

        if (cell === 9) {
          blocksGroup.add(new Block(this.scene, x, y, gridSize));
        } else if (cell === 8) {
          boxesGroup.add(new Box(this.scene, x, y, gridSize));
        }
      });
    });
  }
}
