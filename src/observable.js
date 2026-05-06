class Observable {
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;
  }

  subscribe({ onNext, onError, onComplete }) {
    let isUnsubscribed = false;

    const observer = {
      next(value) {
        if (!isUnsubscribed && onNext) onNext(value);
      },
      error(err) {
        if (!isUnsubscribed && onError) onError(err);
      },
      complete() {
        if (!isUnsubscribed && onComplete) onComplete();
      },
    };

    const cleanup = this._subscribeFn(observer);

    return {
      unsubscribe() {
        isUnsubscribed = true;
        if (cleanup) cleanup();
      },
    };
  }

  static from(values) {
    return new Observable((observer) => {
      for (const value of values) {
        observer.next(value);
      }
      
    });
  }

  static interval(ms) {
    return new Observable((observer) => {
      let count = 0;
      const timer = setInterval(() => {
        observer.next(count++);
      }, ms);
      return () => clearInterval(timer);
    });
  }
}

export { Observable };