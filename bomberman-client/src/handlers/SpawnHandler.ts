import { Player } from "../entities/Player";
import { GameSceneInterface } from "../interfaces/GameSceneInterface";

export class SpawnHandler {
  constructor(private game: GameSceneInterface) {}

  public handle(msg: string): void {
    console.log("[SpawnHandler] handle ->", msg);
    const parts = msg.split(":");
    const name = parts[1];
    const x = parseInt(parts[2]);
    const y = parseInt(parts[3]);

    if (name !== this.game.localPlayerName && !this.game.remotePlayerName) {
      this.game.remotePlayerName = name;
      console.log(`[SpawnHandler] Storing remotePlayerName = ${name}`);
    }

    if (name === this.game.localPlayerName) {
      if (this.game.localDead) {
        console.log("[SpawnHandler] Ignoring spawn for local - localDead is true");
        return;
      }
      if (!this.game.localPlayer) {
        console.log(`[SpawnHandler] Creating local Player for ${name} at (${x},${y})`);
        this.game.localPlayer = new Player(this.game as any, x, y);
      } else {
        console.log(`[SpawnHandler] Re-positioning local Player for ${name} at (${x},${y})`);
        this.game.localPlayer.x = x;
        this.game.localPlayer.y = y;
      }
    } else {
      if (this.game.remoteDead) {
        console.log("[SpawnHandler] Ignoring spawn for remote - remoteDead is true");
        return;
      }
      if (!this.game.remotePlayer) {
        console.log(`[SpawnHandler] Creating remote Player for ${name} at (${x},${y})`);
        this.game.remotePlayer = new Player(this.game as any, x, y);
      } else {
        console.log(`[SpawnHandler] Re-positioning remote Player for ${name} at (${x},${y})`);
        this.game.remotePlayer.x = x;
        this.game.remotePlayer.y = y;
      }
    }
  }
}
