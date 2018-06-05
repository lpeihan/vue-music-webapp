export function leftpad(str, len, ch = ' ') {
  str = `${str}`;

  for (let i = str.length; i < len; i++) {
    str = ch + str;
  }

  return str;
};

export function shuffle(array) {
  const items = array.slice();
  let t, r, i;

  for (i = items.length - 1; i > 0; i--) {
    r = Math.round(Math.random() * i);

    t = items[i];
    items[i] = items[r];
    items[r] = t;
  }

  return items;
}

export function debounce(func, delay) {
  let timer;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}