import { Bomb } from "../entities/Bomb";
import { Explosion } from "../entities/Explosion";
import { Player } from "../entities/Player";
import { CollisionManager } from "../managers/CollisionManager";
import Phaser from "phaser";

export interface GameSceneInterface extends Phaser.Scene {
  gameOverDisplayed: any;
  socketClient: { send(message: string): void };
  localPlayerName: string;
  remotePlayerName?: string;

  localPlayer?: Player;
  remotePlayer?: Player;

  localBomb?: Bomb;
  remoteBomb?: Bomb;
  explosions: Explosion[];

  blocksGroup: Phaser.GameObjects.Group;
  boxesGroup: Phaser.GameObjects.Group;
  
  collisionManager: CollisionManager;

  localDead: boolean;
  remoteDead: boolean;
  processedBombs: Set<string>;

  scheduleGameOver(): void;
}
