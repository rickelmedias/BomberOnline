import Phaser from "phaser";
import { SocketClient } from "../network/SocketClient";

export class LobbyScene extends Phaser.Scene {
  private inputBox!: Phaser.GameObjects.Graphics;
  private inputText!: Phaser.GameObjects.Text;
  private roomInputBox!: Phaser.GameObjects.Graphics;
  private roomInputText!: Phaser.GameObjects.Text;
  private cursor!: Phaser.GameObjects.Text;
  private roomCursor!: Phaser.GameObjects.Text;
  private playText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private statusBackground!: Phaser.GameObjects.Graphics;
  private socketClient!: SocketClient;
  private players: string[] = [];
  private localPlayerName: string = "";
  private roomCode: string = "";
  
  private activeInput: "username" | "room" = "username";
  private cursorVisible: boolean = true;
  private roomCursorVisible: boolean = false;
  private isWaiting: boolean = false;

  constructor() {
    super({ key: "LobbyScene" });
  }

  preload() {
    this.load.image("gameLogo", "assets/BombermanLogo.png");
    this.load.font("BetterVCR", "assets/font/BetterVCR.ttf");
  }

  create() {
    const centerX = this.cameras.main.centerX;

    const currentRoom = window.location.pathname.slice(1);
    if (currentRoom.length === 4) {
      this.roomCode = currentRoom;
    }

    const logo = this.add.image(centerX, 200, "gameLogo").setOrigin(0.5);
    logo.setScale(1.75);

    this.add.text(centerX - 155, 425, "Username", {
      fontSize: "20px",
      fontFamily: "BetterVCR",
      color: "#ffffff"
    }).setOrigin(0.5);
    this.add.text(centerX + 153, 425, "Código Sala", {
      fontSize: "20px",
      fontFamily: "BetterVCR",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Box Username
    this.inputBox = this.add.graphics();
    this.inputBox.lineStyle(3, 0xffffff, 1);
    this.inputBox.strokeRect(centerX - 250, 450, 200, 50);
    this.inputBox.setInteractive(new Phaser.Geom.Rectangle(centerX - 260, 430, 200, 90), Phaser.Geom.Rectangle.Contains)
      .on("pointerdown", () => {
        if (this.isWaiting) return;
        this.activeInput = "username";
      });
    this.inputText = this.add.text(centerX - 240, 475, "", {
      fontSize: "24px",
      fontFamily: "BetterVCR",
      color: "#aaaaaa"
    }).setOrigin(0, 0.5);
    this.inputText.setInteractive().on("pointerdown", () => {
      if (this.isWaiting) return;
      this.activeInput = "username";
    });
    this.cursor = this.add.text(this.inputText.x + this.inputText.width, 475, "▌", {
      fontSize: "24px",
      fontFamily: "BetterVCR",
      color: "#ffffff"
    }).setOrigin(0, 0.5);

    // Box Room Code
    this.roomInputBox = this.add.graphics();
    this.roomInputBox.lineStyle(3, 0xffffff, 1);
    this.roomInputBox.strokeRect(centerX + 75, 450, 150, 50);
    if (window.location.pathname === "/" || window.location.pathname === "") {
      this.roomInputBox.setInteractive(new Phaser.Geom.Rectangle(centerX + 75, 460, 150, 90), Phaser.Geom.Rectangle.Contains)
        .on("pointerdown", () => {
          if (this.isWaiting) return;
          this.activeInput = "room";
        });
    }
    this.roomInputText = this.add.text(centerX + 85, 475, this.roomCode, {
      fontSize: "24px",
      fontFamily: "BetterVCR",
      color: "#aaaaaa"
    }).setOrigin(0, 0.5);
    if (window.location.pathname === "/" || window.location.pathname === "") {
      this.roomInputText.setInteractive().on("pointerdown", () => {
        if (this.isWaiting) return;
        this.activeInput = "room";
      });
    }
    this.roomCursor = this.add.text(this.roomInputText.x + this.roomInputText.width, 475, "▌", {
      fontSize: "24px",
      fontFamily: "BetterVCR",
      color: "#ffffff"
    }).setOrigin(0, 0.5);
    this.roomCursor.setVisible(false);

    // Button Play Online
    this.playText = this.add.text(centerX, 560, "Play Online", {
      fontSize: "32px", 
      fontFamily: "BetterVCR",
      color: "#888888"
    }).setOrigin(0.5)
      .setInteractive()
      .setStyle({ cursor: "pointer" })
      .on("pointerover", () => {
        if (this.canJoin()) this.playText.setColor("#adff2f");
      })
      .on("pointerout", () => {
        if (this.canJoin()) this.playText.setColor("#28a745");
      })
      .on("pointerdown", () => {
        if (this.canJoin()) this.joinRoom();
      });

    this.statusBackground = this.add.graphics();
    this.statusBackground.fillStyle(0x000000, 0.5);
    this.statusBackground.fillRect(centerX - 150, 550, 300, 40);
    this.statusBackground.setVisible(false);
    this.statusText = this.add.text(centerX, 570, "Waiting for players", {
      fontSize: "24px",
      fontFamily: "BetterVCR",
      color: "#ffffff"
    }).setOrigin(0.5);
    this.statusText.setVisible(false);

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.activeInput === "username") {
          this.cursorVisible = !this.cursorVisible;
          this.cursor.setVisible(this.cursorVisible);
          this.roomCursor.setVisible(false);
        } else {
          this.roomCursorVisible = !this.roomCursorVisible;
          this.roomCursor.setVisible(this.roomCursorVisible);
          this.cursor.setVisible(false);
        }
      }
    });

    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (this.isWaiting) return;
      if (event.key === "Tab") {
        event.preventDefault();
        this.activeInput = this.activeInput === "username" ? "room" : "username";
        return;
      }
      if (event.key === "Backspace") {
        if (this.activeInput === "username") {
          this.localPlayerName = this.localPlayerName.slice(0, -1);
        } else {
          if (window.location.pathname === "/" || window.location.pathname === "") {
            this.roomCode = this.roomCode.slice(0, -1);
          }
        }
      } else if (event.key === "Enter") {
        if (this.canJoin()) {
          this.joinRoom();
        }
      } else if (event.key.length === 1) {
        if (this.activeInput === "username") {
          if (this.localPlayerName.length < 8) {
            this.localPlayerName += event.key;
          }
        } else {
          if (window.location.pathname === "/" || window.location.pathname === "") {
            if (this.roomCode.length < 4 && /[a-zA-Z0-9]/.test(event.key)) {
              this.roomCode += event.key;
            }
          }
        }
      }
      this.updateInputTexts();
      this.updatePlayButtonStatus();
    });
  }

  updateInputTexts() {
    this.inputText.setText(this.localPlayerName);
    this.roomInputText.setText(this.roomCode);
    this.cursor.setX(this.inputText.x + this.inputText.width + 5);
    this.roomCursor.setX(this.roomInputText.x + this.roomInputText.width + 5);
  }

  updatePlayButtonStatus() {
    if (this.canJoin()) {
      this.playText.setColor("#28a745");
      this.playText.setInteractive();
    } else {
      this.playText.setColor("#888888");
      this.playText.disableInteractive();
    }
  }

  canJoin(): boolean {
    return this.localPlayerName.trim().length > 0 && this.roomCode.trim().length === 4;
  }

  joinRoom() {
    if (!this.canJoin() || this.isWaiting) return;
    this.isWaiting = true;
    this.statusBackground.setVisible(true);
    this.statusText.setVisible(true);
    this.playText.disableInteractive().setColor("#888888");
    this.inputText.setColor("#888888");
    this.roomInputText.setColor("#888888");

    const roomId = this.roomCode;
    this.socketClient = new SocketClient(roomId, this.localPlayerName);

    this.socketClient.onMessage((msg: string) => {
      console.log("LobbyScene onMessage:", msg);
      if (msg.startsWith("player_joined:")) {
        const joinedName = msg.split(":")[1];
        if (!this.players.includes(joinedName)) {
          this.players.push(joinedName);
        }
        this.statusText.setText("Waiting for another player");
      } else if (msg.startsWith("countdown:")) {
        const count = msg.split(":")[1];
        this.statusText.setText(`Starting in ${count}...`);
      } else if (msg === "start_game") {
        this.scene.start("GameScene", { socketClient: this.socketClient, playerName: this.localPlayerName });
      }
    });
  }
}
