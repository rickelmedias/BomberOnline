import { Explosion } from "../entities/Explosion";
import { GRID_SIZE } from "../constants";
import { GameSceneInterface } from "../interfaces/GameSceneInterface";

export class BombExplosionHandler {
  constructor(private game: GameSceneInterface) {}

  public handle(msg: string): void {
    console.log("[BombExplosionHandler] handle ->", msg);
    const parts = msg.split(":");
    const playerName = parts[1];
    const bombX = parseInt(parts[2]);
    const bombY = parseInt(parts[3]);
    const bombKey = `${Math.floor(bombX / 50)},${Math.floor(bombY / 50)}`;

    if (this.game.processedBombs.has(bombKey)) {
      console.log("[BombExplosionHandler] Ignoring duplicate bomb explosion at", bombKey);
      return;
    }
    this.game.processedBombs.add(bombKey);
    setTimeout(() => {
      this.game.processedBombs.delete(bombKey);
    }, 100);

    const centerX = Math.floor(bombX / GRID_SIZE) * GRID_SIZE;
    const centerY = Math.floor(bombY / GRID_SIZE) * GRID_SIZE;

    const explosion = new Explosion(
      this.game as any,
      centerX,
      centerY,
      GRID_SIZE,
      2,
      this.game.blocksGroup,
      this.game.boxesGroup
    );
    this.game.explosions.push(explosion);

    if (
      !this.game.localDead &&
      this.game.localPlayer &&
      this.game.collisionManager.checkExplosionCollision(explosion, this.game.localPlayer)
    ) {
      console.log("[BombExplosionHandler] Local player was hit by explosion => sending die msg");
      this.game.localDead = true;
      this.game.socketClient.send(`die:${this.game.localPlayerName}`);
    }
    if (
      !this.game.remoteDead &&
      this.game.remotePlayer &&
      this.game.collisionManager.checkExplosionCollision(explosion, this.game.remotePlayer)
    ) {
      console.log("[BombExplosionHandler] Remote player was hit by explosion => sending die msg");
      this.game.remoteDead = true;
      this.game.socketClient.send(`die:${this.game.remotePlayerName}`);
    }
  }
}
