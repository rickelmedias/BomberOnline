import { Bomb } from "../entities/Bomb";
import { GameSceneInterface } from "../interfaces/GameSceneInterface";

export class BombPlacementHandler {
  constructor(private game: GameSceneInterface) {}

  public handle(msg: string): void {
    console.log("[BombPlacementHandler] handle ->", msg);
    const parts = msg.split(":");
    const playerName = parts[1];
    const bombX = parseInt(parts[2]);
    const bombY = parseInt(parts[3]);

    if (playerName === this.game.localPlayerName) return;
    if (!this.game.remoteBomb) {
      this.game.remoteBomb = new Bomb(this.game as Phaser.Scene, bombX, bombY, 3000);
    }
  }
}
