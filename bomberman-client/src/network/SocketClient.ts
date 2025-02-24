export class SocketClient {
  private socket: WebSocket;
  private messageCallback: ((msg: string) => void) | null = null;

  constructor(roomId: string, playerName: string) {
    // Usar o proxy do Nginx (funciona tanto em dev quanto em produção)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // URL do WebSocket via proxy Nginx
    const wsUrl = `${protocol}//${host}/ws/${roomId}`;
    
    console.log(`Connecting to WebSocket at: ${wsUrl}`);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("WebSocket connection established");
      this.send(`join:${playerName}`);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("Received from server:", event.data);
      if (this.messageCallback) {
        this.messageCallback(event.data);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  onMessage(callback: (msg: string) => void) {
    this.messageCallback = callback;
  }

  send(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn("Socket is not open. Message not sent:", message);
    }
  }

  reconnect() {
    if (this.socket.readyState === WebSocket.CLOSED) {
      const url = this.socket.url;
      this.socket = new WebSocket(url);
      console.log("Attempting to reconnect to WebSocket...");
    }
  }

  close() {
    this.socket.close();
  }
}