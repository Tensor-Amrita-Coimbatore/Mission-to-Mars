class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(playerId) {
    if (this.socket) {
      this.socket.close();
    }

    const wsUrl = `ws://localhost:8000/ws/${playerId}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(`WebSocket connected for ${playerId}`);
      this.emit('connect');
    };

    this.socket.onclose = () => {
      console.log(`WebSocket disconnected for ${playerId}`);
      this.emit('disconnect');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Emit a generic 'message' event and a type-specific event
        this.emit('message', data);
        if (data.type) {
          this.emit(data.type, data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }

  sendMessage(type, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, data });
      this.socket.send(message);
    } else {
      console.error('Cannot send message, WebSocket is not open.');
    }
  }

  // Add a listener for a specific event type
  on(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  // Remove a listener
  off(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(
        (cb) => cb !== callback
      );
    }
  }

  // Emit an event to all its listeners
  emit(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.listeners = {};
    }
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService();