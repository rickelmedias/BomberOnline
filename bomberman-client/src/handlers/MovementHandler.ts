import { GameSceneInterface } from "../interfaces/GameSceneInterface";

export class MovementHandler {
  constructor(private game: GameSceneInterface) {}

  public handle(msg: string): void {
    console.log("[MovementHandler] handle ->", msg);
    const parts = msg.split(":");
    const pName = parts[1];
    const x = parseInt(parts[2]);
    const y = parseInt(parts[3]);

    if (pName === this.game.localPlayerName && this.game.localPlayer && !this.game.localDead) {
      this.game.localPlayer.x = x;
      this.game.localPlayer.y = y;
    } else if (this.game.remotePlayerName === pName && this.game.remotePlayer && !this.game.remoteDead) {
      const prevX = this.game.remotePlayer.x;
      const prevY = this.game.remotePlayer.y;
      let animationKey = "";

      if (x > prevX) {
        animationKey = "player_walk_right_anim";
      } else if (x < prevX) {
        animationKey = "player_walk_left_anim";
      } else if (y > prevY) {
        animationKey = "player_walk_down_anim";
      } else if (y < prevY) {
        animationKey = "player_walk_up_anim";
      }

      if (animationKey) {
        this.game.remotePlayer.play(animationKey);
      }
      this.game.remotePlayer.x = x;
      this.game.remotePlayer.y = y;
    }
  }
}
