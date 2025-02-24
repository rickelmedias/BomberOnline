import Phaser from "phaser";
import { SocketClient } from "../network/SocketClient";
import { Bomb } from "../entities/Bomb";
import { Explosion } from "../entities/Explosion";
import { Player } from "../entities/Player";
import { SpriteLoader } from "../animations/SpriteLoader";
import { AnimationsCreator } from "../animations/AnimationsCreator";
import { LevelBuilder } from "../managers/LevelBuilder";
import { SocketMessageDispatcher } from "../handlers/SocketMessageDispatcher";
import { InputHandler, MovementCommand } from "../handlers/InputHandler";
import { UIManager } from "../managers/UIManager";
import { CollisionManager } from "../managers/CollisionManager";
import { GameState, GameStateManager } from "../managers/GameStateManager";

import { BombPlacementHandler } from "../handlers/BombPlacementHandler";
import { SpawnHandler } from "../handlers/SpawnHandler";
import { MovementHandler } from "../handlers/MovementHandler";
import { BombExplosionHandler } from "../handlers/BombExplosionHandler";
import { DieHandler } from "../handlers/DieHandler";

import { GameSceneInterface } from "../interfaces/GameSceneInterface";

const GRID_SIZE = 50;
const IS_DEBUG = false;

const SCENARIO: number[][] = [
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  [9, 0, 0, 8, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9],
  [9, 0, 8, 8, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9],
  [9, 8, 8, 9, 0, 0, 0, 9, 0, 0, 8, 0, 9, 0, 0, 9],
  [9, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
  [9, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
  [9, 8, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 9],
  [9, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9],
  [9, 0, 0, 9, 0, 0, 0, 9, 0, 0, 0, 0, 9, 8, 8, 9],
  [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 0, 9],
  [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 2, 9],
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
];

export class GameScene extends Phaser.Scene implements GameSceneInterface {
  public socketClient!: SocketClient;
  public localPlayerName!: string;
  public remotePlayerName?: string;

  public localPlayer?: Player;
  public remotePlayer?: Player;

  public localBomb?: Bomb;
  public remoteBomb?: Bomb;
  public explosions: Explosion[] = [];

  public blocksGroup!: Phaser.GameObjects.Group;
  public boxesGroup!: Phaser.GameObjects.Group;

  public collisionManager!: CollisionManager;
  public gameStateManager!: GameStateManager;

  public localDead = false;
  public remoteDead = false;
  public gameOverDisplayed = false;


  public processedBombs: Set<string> = new Set();

  private moveDelay = 200;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { socketClient: SocketClient; playerName: string }) {
    this.socketClient = data.socketClient;
    this.localPlayerName = data.playerName;
    console.log("[GameScene] init -> local player:", this.localPlayerName);
  }

  preload() {
    SpriteLoader(this);
  }

  create() {
    AnimationsCreator(this);
    this.add.text(10, 10, "Multiplayer Bomberman", { color: "#fff" });

    this.blocksGroup = this.add.group();
    this.boxesGroup = this.add.group();

    const levelBuilder = new LevelBuilder(this);
    levelBuilder.buildLevel(SCENARIO, GRID_SIZE, this.blocksGroup, this.boxesGroup);

    this.collisionManager = new CollisionManager(this, this.blocksGroup, this.boxesGroup, GRID_SIZE, IS_DEBUG);

    this.gameStateManager = new GameStateManager();
    this.gameStateManager.setState(GameState.PLAYING);

    console.log("[GameScene] Requesting spawns from server...");
    this.socketClient.send("request_spawns");

    const bombPlacementHandler = new BombPlacementHandler(this);
    const spawnHandler = new SpawnHandler(this);
    const movementHandler = new MovementHandler(this);
    const bombExplosionHandler = new BombExplosionHandler(this);
    const dieHandler = new DieHandler(this);

    const dispatcher = new SocketMessageDispatcher();
    dispatcher.register("spawn:", (msg) => spawnHandler.handle(msg));
    dispatcher.register("player_position:", (msg) => movementHandler.handle(msg));
    dispatcher.register("bomb_exploded:", (msg) => bombExplosionHandler.handle(msg));
    dispatcher.register("die:", (msg) => dieHandler.handle(msg));
    dispatcher.register("place_bomb:", (msg) => bombPlacementHandler.handle(msg));
    dispatcher.register("countdown:", (msg) => console.log("[GameScene] countdown ->", msg));
    dispatcher.register("start_game", (msg) =>
      console.log("[GameScene] Start Game received")
    );

    this.socketClient.onMessage((msg: string) => {
      console.log("[GameScene] onMessage ->", msg);
      dispatcher.dispatch(msg);
    });

    this.events.on("bomb_exploded", (bx: number, by: number) => {
      console.log("[GameScene] local bomb exploded at:", bx, by);
      this.socketClient.send(`bomb_exploded:${this.localPlayerName}:${bx}:${by}`);
    });

    const inputHandler = new InputHandler(this, this.moveDelay);
    inputHandler.setup(
      (movement: MovementCommand) => {
        if (this.localPlayer && !this.localDead) {
          this.localPlayer.play(movement.animationKey);
          const newX = this.localPlayer.x + movement.dx;
          const newY = this.localPlayer.y + movement.dy;
          console.log(`[GameScene] Posição atual: (${this.localPlayer.x}, ${this.localPlayer.y})`);
          console.log(`[GameScene] Tentando mover para: (${newX}, ${newY})`);

          if (IS_DEBUG) {
            this.collisionManager.clearDebug();
          }

          if (!this.collisionManager.isMovementBlocked(newX, newY)) {
            console.log(`[GameScene] Movimento permitido para (${newX}, ${newY})`);
            this.socketClient.send(`move:${movement.dx},${movement.dy}`);
            this.localPlayer.x = newX;
            this.localPlayer.y = newY;
          } else {
            console.log("[GameScene] Movimento bloqueado por obstáculo");
          }
        }
      },
      () => {
        this.placeBomb();
      }
    );
  }

  update(time: number, delta: number) {
    if (this.localBomb) {
      this.localBomb.update(time, delta);
      if (this.localBomb.exploded) {
        this.localBomb = undefined;
      }
    }
    if (this.remoteBomb) {
      this.remoteBomb.update(time, delta);
      if (this.remoteBomb.exploded) {
        this.remoteBomb = undefined;
      }
    }
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.update(time, delta);
      if (!explosion.isActive()) {
        this.explosions.splice(i, 1);
      }
    }
  }

  private placeBomb() {
    if (!this.localBomb && this.localPlayer && !this.localDead) {
      const tileX = Math.floor(this.localPlayer.x / GRID_SIZE) * GRID_SIZE;
      const tileY = Math.floor(this.localPlayer.y / GRID_SIZE) * GRID_SIZE;
      const bombX = tileX + GRID_SIZE / 2;
      const bombY = tileY + GRID_SIZE / 2;
      console.log("[GameScene] placing bomb at", bombX, bombY);
      this.localBomb = new Bomb(this, bombX, bombY, 3000);
      this.socketClient.send(`place_bomb: ${ this.localPlayerName }: ${ bombX }: ${ bombY }`);
    }
  }

  public scheduleGameOver() {
    if (this.gameOverDisplayed) return;
    this.gameOverDisplayed = true;

    this.gameStateManager.setState(GameState.GAME_OVER);

    this.time.delayedCall(3000, () => {
      let result = "";
      if (this.localDead && this.remoteDead) {
        result = "Draw!";
      } else if (this.localDead && !this.remoteDead) {
        result = "You Lose!";
      } else if (!this.localDead && this.remoteDead) {
        result = "You Win!";
      } else {
        result = "???";
      }
      const uiManager = new UIManager(this);
      uiManager.showGameOver(result, () => {
        window.location.href = "/";
      });
    });
  }
}
