export enum GameState {
    INIT = "INIT",
    PLAYING = "PLAYING",
    GAME_OVER = "GAME_OVER",
  }
  
  export type GameStateListener = (state: GameState) => void;
  
  export class GameStateManager {
    private currentState: GameState = GameState.INIT;
    private listeners: GameStateListener[] = [];
  
    public getState(): GameState {
      return this.currentState;
    }
  
    public setState(newState: GameState): void {
      if (this.currentState !== newState) {
        this.currentState = newState;
        this.notifyListeners();
      }
    }
  
    public addListener(listener: GameStateListener): void {
      this.listeners.push(listener);
    }
  
    private notifyListeners(): void {
      this.listeners.forEach((listener) => listener(this.currentState));
    }
  }
  