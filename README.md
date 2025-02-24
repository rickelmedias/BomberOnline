# Bomberman Online

Bomberman Online is an educational project that implements an online Bomberman clone. The application consists of a client built with TypeScript and Phaser, and a server developed in Python using FastAPI.

> **Note:**  
> The spritesheets were obtained from [Spriters Resource](https://www.spriters-resource.com/nes/bomberman/) and the BetterVCR font from [Dafont](https://www.dafont.com/better-vcr.font). This project is for educational purposes only and is not intended for commercial use. Proper credit to the original rights holders is recommended.


## Youtube Overview

[![BomberOnline Youtube Overview](https://img.youtube.com/vi/oLfkm_ia6xI/0.jpg)](https://www.youtube.com/watch?v=oLfkm_ia6xI)

---

## Getting Started

The project is organized into two main directories:

- **[bomberman-client](./bomberman-client/README.md):** Contains the client application (TypeScript/Phaser).
- **[bomberman-server](./bomberman-server/README.md):** Contains the server application (Python/FastAPI).

A `docker-compose.yml` file at the root of the project allows you to run both the client and server together with a single command:

```bash
docker-compose up --build
```

---

## Overview

A demonstration video is included in the repository – please see the video below for a walkthrough of the project.

For more detailed information about each component, please refer to the individual README files in the `bomberman-client` and `bomberman-server` directories.

##### Setting Enviroment _(Terminal)_
- [x] __Feat__: Setting up __Typescript__ | __Nodejs__ | __Phaser__
- [x] __Feat__: Setting up __Python__ Environment | __FastAPI__

##### Typescript Development _(Code .ts)_
- [x] __Feat__: Develop game using Typescript with _Phaser_ _(GameScene.ts)_
    - [x] __Feat__: Grid Based Movement _(Player.ts)_
    - [x] __Feat__: Grid Bomb Placement _(Bomb.ts)_
    - [x] __Feat__: Explosion Propagation _(Explosion.ts)_
    - [x] __Feat__: Collision Objects _(Box.ts, Block.ts)_
    - [x] __Feat__: Explosion Destroy _Box.ts & Player.ts_
- [x] __Bug Fix__: Collision not working properly
    - [x] __Feat__: Develop Debug Boxes to Understand the Collision better
    - [x] __Fix__: Check collisions and Fix the Code

##### Python Development  _(Code .py)_
- [x] __Feat__: Develop game server using Python with _FastAPI_
    - [x] __Feat__: Websockets for Communication between players 
    - [x] __Feat__: Join Handle to control the room, because to play is needed two players looking match in the same room code _(join)_
    - [x] __Feat__: Spawn Handle to control the spawn of Players _(request_spawns)_
    - [x] __Feat__: Develop more handles for all the game actions _(move, place bomb, bomb explosion, die)_

##### Integrations Client/Server and Improvements _(Code)_
- [x] __Feat__: Integration between Client _(Typescript game)_ and Server _(Python FastAPI server)_
    - [x] __Feat__: Create a custom lobby to search a match usign username and room code
    - [x] __Refactor__: Refactoring of the Code for both thinking about the Modularization and Good Practices
    - [x] __Refactor__: Use of Modularization, Design Pattern and SOLID to improve the code separating big code with a lot of responsabilities in modules _(specially the GameScene.ts that was doing a lot of things)_
    - [x] __Feat__: Develop handlers to exchange informations between clients using the server _(websocket)_

##### Visual Improvements  _(Code)_
- [x] __Feat__: Improve the Design of the Game and Lobby
    - [x] __Feat__: Search for Sprites, Load and Create
    - [x] __Feat__: Change the Entities Code to be a Sprite instead Blocks
    - [x] __Refactor__: Improve the Lobby code
    - [x] __Feat__: Design and Develop full custom Lobby

##### Final Step _(Clean Code)_
- [x] __Feat__: Fine-tuning on Client and Server for more Modularization, Code Cleaner and some short implementations
- [x] __Test__: Tests and Validations

##### Infrastructure _(Docker)_
- [x] __Feat__: Containerization of Client and Server
    - [x] __Feat__: Nginx (Client)
    - [x] __Feat__: Nodejs (Client)
    - [x] __Feat__: Python (Server)
- [x] __Test__: Test Containers Running Manually and Separated
- [x] __Feat__: Docker-compose.yaml to run easilly both applications integrated