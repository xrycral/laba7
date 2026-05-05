class SafeEventEmitter {
  constructor() {
    this._listeners = {};
  }

  on(event, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(
      (l) => l !== listener
    );
  }

  emit(event, ...args) {
    const listeners = this._listeners[event] || [];
    for (const listener of listeners) {
      listener(...args);
    }
  }

  removeAllListeners(event) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
  }
}

export { SafeEventEmitter };
