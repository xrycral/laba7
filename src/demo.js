import { SafeEventEmitter } from './eventEmitter.js';

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

demoMultipleListeners();