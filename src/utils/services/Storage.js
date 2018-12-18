const PREFIX = 'shlink';
const buildPath = (path) => `${PREFIX}.${path}`;

export default class Storage {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  get = (key) => {
    const item = this.localStorage.getItem(buildPath(key));

    return item ? JSON.parse(item) : undefined;
  };

  set = (key, value) => this.localStorage.setItem(buildPath(key), JSON.stringify(value));
}
