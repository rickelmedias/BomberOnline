import { GameSceneInterface } from "../interfaces/GameSceneInterface";

export class DieHandler {
  constructor(private game: GameSceneInterface) {}

  public handle(msg: string): void {
    console.log("[DieHandler] handle ->", msg);
    const parts = msg.split(":");
    const deadName = parts[1];
    console.log(`[DieHandler] handle -> deadName = ${deadName}`);

    if (deadName === this.game.localPlayerName) {
      this.game.localDead = true;
      if (this.game.localPlayer) {
        console.log("[DieHandler] => destroying localPlayer sprite");
        this.game.localPlayer.destroy();
        this.game.localPlayer = undefined;
      }
    } else if (this.game.remotePlayerName && deadName === this.game.remotePlayerName) {
      this.game.remoteDead = true;
      if (this.game.remotePlayer) {
        console.log("[DieHandler] => destroying remotePlayer sprite");
        this.game.remotePlayer.destroy();
        this.game.remotePlayer = undefined;
      }
    }
    if (!this.game.gameOverDisplayed) {
      this.game.scheduleGameOver();
    }
  }
}
