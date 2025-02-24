import Phaser from "phaser";

export class UIManager {
  constructor(private scene: Phaser.Scene) {}

  public showGameOver(result: string, onPlayAgain?: () => void): void {
    const overlay = this.scene.add.container(0, 0).setDepth(9999);
    const bg = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    const msg = this.scene.add
      .text(400, 250, result, { fontSize: "48px", color: "#fff" })
      .setOrigin(0.5);
    const btn = this.scene.add
      .text(400, 350, "Play Again", {
        fontSize: "32px",
        color: "#0f0",
        backgroundColor: "#000",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        if (onPlayAgain) {
          onPlayAgain();
        }
      });
    overlay.add([bg, msg, btn]);
  }
}
