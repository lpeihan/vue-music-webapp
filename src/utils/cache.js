function serialize(val) {
  return JSON.stringify(val);
}

function deserialize(val) {
  return JSON.parse(val);
}

const storage = {
  store: window.localStorage,

  getItem(key) {
    return deserialize(this.store.getItem(key));
  },
  setItem(key, val) {
    this.store.setItem(key, serialize(val));

    return val;
  },
  removeItem(key) {
    this.store.removeItem(key);
  }
};

export default storage;