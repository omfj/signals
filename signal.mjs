let currentEffect = null;

export const createSignal = (initialValue) => {
  let value = initialValue;
  const observers = new Set();

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
};

export const createEffect = (fn) => {
  const run = () => {
    currentEffect = run;
    fn();
    currentEffect = null;
  };

  run();
};

export const createDerived = (signals, fn) => {
  const [getter, setter] = createSignal();
  createEffect(() => {
    const value = fn(...signals.map((signal) => signal()));
    setter(value);
  });
  return getter;
};
