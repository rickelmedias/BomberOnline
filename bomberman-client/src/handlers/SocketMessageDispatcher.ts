export type MessageHandler = (msg: string) => void;

export class SocketMessageDispatcher {
  private handlers: { [key: string]: MessageHandler } = {};

  public register(prefix: string, handler: MessageHandler): void {
    this.handlers[prefix] = handler;
  }

  public dispatch(msg: string): void {
    for (const prefix in this.handlers) {
      if (msg.startsWith(prefix)) {
        this.handlers[prefix](msg);
        return;
      }
    }
    console.warn("Unhandled socket message:", msg);
  }
}
