export class Store {
  /** Type of storage we want to use: 'localStorage' or 'AsyncStorage' */
  type;
  storeAsync = false;

  /** Initialize storage with one of the supported options */
  constructor() {
    this.type = localStorage;
  }

  /** Function to set an item storage */
  async setItem(key: string, value: string) {
    switch (this.storeAsync) {
      /** Browser storage */
      case false:
        localStorage.setItem(key, value);
        return true;

      /** Async storage */
      case true:
        await this.type.setItem(key, value);
        return true;
    }
  }

  /** Function to retrieve an item storage */
  async getItem(key: string) {
    let res;
    switch (this.storeAsync) {
      /** Browser storage */
      case false:
        res = localStorage.getItem(key);
        break;

      /** Async storage */
      case true:
        res = await this.type.getItem(key);
        break;
    }
    return res;
  }

  /** Function to remove an item from the local storage */
  async removeItem(key: string) {
    switch (this.storeAsync) {
      /** Browser storage */
      case false:
        localStorage.removeItem(key);
        return true;

      /** Async storage */
      case true:
        await this.type.removeItem(key);
        return true;
    }
  }
}
