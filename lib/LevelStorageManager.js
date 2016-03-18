import { StorageManager, EJSON } from 'marsdb';
import levelup from 'levelup';
import mkdirp from 'mkdirp';


// Internals
let _defaultStorageLocation = './database';
const _stores = {};


/**
 * LevelUP storage implementation.
 */
export default class LevelStorageManager extends StorageManager {
  constructor(db, options = {}) {
    super(db, options);
  }

  static defaultStorageLocation() {
    if (arguments.length > 0) {
      _defaultStorageLocation = arguments[0];
    } else {
      return _defaultStorageLocation;
    }
  }

  destroy() {
    return this.loaded().then(() => {
      return new Promise((resolve, reject) => {
        const delPromises = [];
        this._storage.createKeyStream()
        .on('data', (key) => {
          delPromises.push(this.delete(key));
        })
        .on('end', () => {
          resolve(Promise.all(delPromises));
        });
      });
    });
  }

  persist(key, value) {
    return this.loaded().then(() => {
      return new Promise((resolve, reject) => {
        this._storage.put(key, EJSON.stringify(value), (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      });
    });
  }

  delete(key) {
    return this.loaded().then(() => {
      return new Promise((resolve, reject) => {
        this._storage.del(key, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      });
    });
  }

  get(key) {
    return this.loaded().then(() => {
      return new Promise((resolve, reject) => {
        this._storage.get(key, (err, value) => {
          if (value !== undefined) {
            resolve(EJSON.parse(value));
          } else {
            resolve(undefined);
          }
        });
      });
    });
  }

  createReadStream(options = {}) {
    return this._storage.createReadStream(options);
  }

  _loadStorage() {
    const dbName = this.db.modelName;
    const storageLocation = this.options.storageLocation || _defaultStorageLocation;
    const dbLocation = storageLocation + '/' + dbName;

    mkdirp.sync(dbLocation);

    if (!_stores[dbLocation]) {
      _stores[dbLocation] = new Promise((resolve, reject) => {
        levelup(dbLocation, this.options, (err, db) => {
          if (err) {
            reject(err);
          } else {
            resolve(db);
          }
        });
      });
    }

    return _stores[dbLocation].then((res) => {
      this._storage = res;
    });
  }
}
