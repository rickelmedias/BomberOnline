import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Explosion } from "../entities/Explosion";

export class CollisionManager {
  private debugGraphics?: Phaser.GameObjects.Graphics;

  constructor(
    private scene: Phaser.Scene,
    private blocksGroup: Phaser.GameObjects.Group,
    private boxesGroup: Phaser.GameObjects.Group,
    private gridSize: number,
    private isDebug: boolean
  ) {}

  public isMovementBlocked(newX: number, newY: number): boolean {
    const newBounds = new Phaser.Geom.Rectangle(
      newX,
      newY,
      this.gridSize,
      this.gridSize,
    );
  
    if (this.isDebug) {
      this.drawDebugRect(newBounds, 0xff0000);
    }
    
    let blocked = false;

    this.blocksGroup.getChildren().forEach((obj) => {
      const block = obj as Phaser.GameObjects.Rectangle;
      const blockBounds = block.getBounds();
      
      if (this.isDebug) {
        this.drawDebugRect(blockBounds, 0x0000ff);
      }
      
      if (
        newX < blockBounds.x + blockBounds.width &&
        newX + this.gridSize > blockBounds.x &&
        newY < blockBounds.y + blockBounds.height &&
        newY + this.gridSize > blockBounds.y
      ) {
        console.log(`Colisão com bloco em (${blockBounds.x}, ${blockBounds.y})`);
        blocked = true;
      }
    });

    this.boxesGroup.getChildren().forEach((obj) => {
      const box = obj as Phaser.GameObjects.Rectangle;
      const boxBounds = box.getBounds();
      
      if (this.isDebug) {
        this.drawDebugRect(boxBounds, 0x00ff00);
      }
      
      if (
        newX < boxBounds.x + boxBounds.width &&
        newX + this.gridSize > boxBounds.x &&
        newY < boxBounds.y + boxBounds.height &&
        newY + this.gridSize > boxBounds.y
      ) {
        console.log(`Colisão com caixa em (${boxBounds.x}, ${boxBounds.y})`);
        blocked = true;
      }
    });

    return blocked;
  }

  public checkExplosionCollision(explosion: Explosion, player: Player): boolean {
    return explosion.checkCollisionWithPlayer(player);
  }
  
  private drawDebugRect(rect: Phaser.Geom.Rectangle, color: number): void {
    if (!this.debugGraphics) {
      this.debugGraphics = this.scene.add.graphics();
    }
    
    this.debugGraphics.lineStyle(2, color);
    this.debugGraphics.strokeRectShape(rect);
    
    this.scene.time.delayedCall(2000, () => {
      if (this.debugGraphics) {
        this.debugGraphics.clear();
      }
    });
  }
  
  public clearDebug(): void {
    if (this.debugGraphics) {
      this.debugGraphics.clear();
      this.debugGraphics.destroy();
      this.debugGraphics = undefined;
    }
  }
}