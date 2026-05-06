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
      try {
        listener(...args);
      } catch (err) {
        this._handleListenerError(err, event);
      }
    }
  }

  _handleListenerError(err, sourceEvent) {
    const errListeners = this._listeners['error'] || [];

    if (errListeners.length === 0) {
      console.warn(`[emitter] unhandled error in "${sourceEvent}":`, err.message);
      return;
    }

    for (const l of errListeners) {
      try {
        l(err, sourceEvent);
      } catch (e) {
        console.error('[emitter] error in error listener:', e.message);
      }
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