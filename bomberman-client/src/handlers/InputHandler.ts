export type MovementCommand = { dx: number; dy: number; animationKey: string };

export class InputHandler {
  private moveDelay: number;
  private lastMoveTime: number = 0;
  
  constructor(private scene: Phaser.Scene, moveDelay: number = 200) {
    this.moveDelay = moveDelay;
  }

  public setup(
    onMove: (cmd: MovementCommand) => void,
    onPlaceBomb: () => void
  ): void {
    this.scene.input.keyboard!.on("keydown", (evt: KeyboardEvent) => {
      const now = this.scene.time.now;
      if (now - this.lastMoveTime < this.moveDelay) return;

      if (evt.key === " ") {
        onPlaceBomb();
        return;
      }

      let dx = 0,
        dy = 0;
      let animationKey = "";
      switch (evt.key.toLowerCase()) {
        case "w":
          dy = -50;
          animationKey = "player_walk_up_anim";
          break;
        case "a":
          dx = -50;
          animationKey = "player_walk_left_anim";
          break;
        case "s":
          dy = 50;
          animationKey = "player_walk_down_anim";
          break;
        case "d":
          dx = 50;
          animationKey = "player_walk_right_anim";
          break;
        default:
          return;
      }
      this.lastMoveTime = now;
      
      console.log(`[InputHandler] Movimento solicitado: dx=${dx}, dy=${dy}`);
      
      onMove({ dx, dy, animationKey });
    });
  }
}