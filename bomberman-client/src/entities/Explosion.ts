import Phaser from "phaser";

export class Explosion {
  private scene: Phaser.Scene;
  private explosionParts: Phaser.GameObjects.Sprite[] = [];
  private duration: number = 500;
  private startTime: number;
  private gridSize: number;
  private range: number;
  private blocksGroup: Phaser.GameObjects.Group;
  private boxesGroup: Phaser.GameObjects.Group;
  private explodedTiles: Set<string> = new Set();

  constructor(
    scene: Phaser.Scene,
    bombCenterX: number,
    bombCenterY: number,
    gridSize: number,
    range: number,
    blocksGroup: Phaser.GameObjects.Group,
    boxesGroup: Phaser.GameObjects.Group
  ) {
    this.scene = scene;
    this.startTime = scene.time.now;
    this.gridSize = gridSize;
    this.range = range;
    this.blocksGroup = blocksGroup;
    this.boxesGroup = boxesGroup;

    const cellX = Math.floor(bombCenterX / gridSize);
    const cellY = Math.floor(bombCenterY / gridSize);
    const rootX = cellX * gridSize;
    const rootY = cellY * gridSize;

    this.addExplosionPart(rootX, rootY, "center");

    this.spreadExplosion(rootX, rootY, 0, -1); // Up
    this.spreadExplosion(rootX, rootY, 0, 1);  // Down
    this.spreadExplosion(rootX, rootY, -1, 0); // Left
    this.spreadExplosion(rootX, rootY, 1, 0);  // Right
  }

  private addExplosionPart(x: number, y: number, type: string) {
    const key = `${x},${y}`;
    if (this.explodedTiles.has(key)) return;
    this.explodedTiles.add(key);

    let frame: number;
    switch (type) {
      case "center":
        frame = 86;
        break;
      case "horizontal":
        frame = 85;
        break;
      case "vertical":
        frame = 100;
        break;
      case "finalLeft":
        frame = 84;
        break;
      case "finalRight":
        frame = 88;
        break;
      case "finalUp":
        frame = 58;
        break;
      case "finalDown":
        frame = 114;
        break;
      default:
        frame = 86;
        break;
    }

    const sprite = this.scene.add.sprite(
      x + this.gridSize / 2,
      y + this.gridSize / 2,
      "bombermanSheet",
      frame
    );
    sprite.setOrigin(0.5, 0.5);

    const scaleFactor = 50 / 16;
    sprite.setScale(scaleFactor);
    
    sprite.setDepth(7);
    sprite.setAlpha(0.8);
    this.explosionParts.push(sprite);
  }

  private spreadExplosion(startX: number, startY: number, dx: number, dy: number) {
    let shouldContinue = true;

    for (let i = 1; i <= this.range && shouldContinue; i++) {
      const x = startX + dx * i * this.gridSize;
      const y = startY + dy * i * this.gridSize;
      const key = `${x},${y}`;

      if (this.explodedTiles.has(key)) {
        shouldContinue = false;
        continue;
      }

      let hitBlock = false;
      for (const block of this.blocksGroup.getChildren()) {
        const blockRect = block as Phaser.GameObjects.Rectangle;
        if (blockRect.x === x && blockRect.y === y) {
          hitBlock = true;
          shouldContinue = false;
          break;
        }
      }

      if (hitBlock) {
        break;
      }

      let hitBox = false;
      for (const box of this.boxesGroup.getChildren()) {
        const boxRect = box as Phaser.GameObjects.Rectangle;
        if (boxRect.x === x && boxRect.y === y) {
          hitBox = true;

          if (dx === -1) {
            this.addExplosionPart(x, y, "finalLeft");
          } else if (dx === 1) {
            this.addExplosionPart(x, y, "finalRight");
          } else if (dy === -1) {
            this.addExplosionPart(x, y, "finalUp");
          } else if (dy === 1) {
            this.addExplosionPart(x, y, "finalDown");
          }

          boxRect.destroy();
          this.boxesGroup.remove(box, true, true);
          shouldContinue = false;
          break;
        }
      }

      if (hitBox) {
        break;
      }

      if (i === this.range) {
        if (dx === -1) {
          this.addExplosionPart(x, y, "finalLeft");
        } else if (dx === 1) {
          this.addExplosionPart(x, y, "finalRight");
        } else if (dy === -1) {
          this.addExplosionPart(x, y, "finalUp");
        } else if (dy === 1) {
          this.addExplosionPart(x, y, "finalDown");
        }
      } else if (shouldContinue) {
        if (dx !== 0) {
          this.addExplosionPart(x, y, "horizontal");
        } else if (dy !== 0) {
          this.addExplosionPart(x, y, "vertical");
        }
      }
    }
  }

  update(time: number, delta: number) {
    if (time - this.startTime > this.duration) {
      this.explosionParts.forEach(part => part.destroy());
      this.explosionParts = [];
    } else {
      const remainingTime = this.duration - (time - this.startTime);
      const alpha = Math.max(0, remainingTime / this.duration);
      this.explosionParts.forEach(part => part.setAlpha(alpha * 0.8));
    }
  }

  isActive(): boolean {
    return this.explosionParts.length > 0;
  }

  checkCollisionWithPlayer(playerSprite: Phaser.GameObjects.Sprite): boolean {
    const margin = this.gridSize * 0.1;
    const playerBounds = playerSprite.getBounds();
    const playerCenter = {
      x: playerBounds.centerX,
      y: playerBounds.centerY,
    };

    for (const part of this.explosionParts) {
      const partBounds = part.getBounds();
      if (
        playerCenter.x > partBounds.x + margin &&
        playerCenter.x < partBounds.right - margin &&
        playerCenter.y > partBounds.y + margin &&
        playerCenter.y < partBounds.bottom - margin
      ) {
        return true;
      }
    }
    return false;
  }
}
