import { SafeEventEmitter } from './eventEmitter.js';
import { Observable } from './observable.js';

function demoMultipleListeners() {
  console.log('=== Demo 1: Multiple Listeners ===\n');

  const emitter = new SafeEventEmitter();

  const unsub1 = emitter.on('message', (msg) => {
    console.log(`[Logger] got message: "${msg}"`);
  });

  const unsub2 = emitter.on('message', (msg) => {
    console.log(`[Analytics] tracking: "${msg}"`);
  });

  emitter.on('message', () => {
    throw new Error('Broken listener');
  });

  emitter.on('message', (msg) => {
    console.log(`[Notifier] sending push: "${msg}"`);
  });

  emitter.on('error', (err, src) => {
    console.error(`[ErrorChannel] from "${src}": ${err.message}`);
  });

  emitter.emit('message', 'Hello World');

  console.log('\n--- unsubscribing first two ---\n');
  unsub1();
  unsub2();

  emitter.emit('message', 'Second message');
}

function demoErrorChannel() {
  console.log('\n=== Demo 2: Error Channel ===\n');

  const emitter = new SafeEventEmitter();

  emitter.on('data', () => {
    throw new Error('something broke in data handler');
  });

  emitter.on('error', (err, src) => {
    console.error(`[ErrorChannel] from "${src}": ${err.message}`);
  });

  emitter.emit('data', 42);
}

function demoObservable() {
  console.log('\n=== Demo 3: Observable ===\n');

  const nums = Observable.from([1, 2, 3, 4, 5]);

  nums.subscribe({
    onNext: (v) => console.log(`[Sub1] value: ${v}`),
    onComplete: () => console.log('[Sub1] done'),
  });

  nums.subscribe({
    onNext: (v) => console.log(`[Sub2] squared: ${v * v}`),
    onComplete: () => console.log('[Sub2] done'),
  });
}

function demoInterval() {
  console.log('\n=== Demo 4: Interval + Unsubscribe ===\n');

  const ticker = Observable.interval(100);

  const sub = ticker.subscribe({
    onNext: (tick) => console.log(`[Ticker] tick: ${tick}`),
  });

  setTimeout(() => {
    sub.unsubscribe();
    console.log('[Ticker] stopped');
  }, 350);
}

demoMultipleListeners();
demoErrorChannel();
demoObservable();
demoInterval();