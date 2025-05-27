let globalLock: Promise<void> = Promise.resolve();

export default function acquireLock() {
  let release: () => void;
  const lock = new Promise<void>(resolve => (release = resolve));
  const prev = globalLock;
  globalLock = globalLock.then(() => lock);
  return prev.then(() => release!);
}