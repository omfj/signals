let currentEffect = null;

export function createSignal(initialValue) {
  let value = initialValue;
  const observers = new Set(); // Use a Set to automatically handle unique subscription

  const getter = () => {
    if (currentEffect) observers.add(currentEffect);
    return value;
  };

  const setter = (newValue) => {
    if (value !== newValue) {
      value = newValue;
      observers.forEach((fn) => fn());
    }
  };

  return [getter, setter];
}

export function createEffect(fn) {
  const run = () => {
    currentEffect = run;
    fn();
    currentEffect = null;
  };

  run();
}

export function createDerived(signals, fn) {
  const [getter, setter] = createSignal();
  createEffect(() => {
    const value = fn(signals.map((signal) => signal()));
    setter(value);
  });
  return getter;
}
