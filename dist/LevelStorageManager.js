'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _marsdb = require('marsdb');

var _levelup = require('levelup');

var _levelup2 = _interopRequireDefault(_levelup);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Internals
var _defaultStorageLocation = './database';
var _stores = {};

/**
 * LevelUP storage implementation.
 */

var LevelStorageManager = (function (_StorageManager) {
  _inherits(LevelStorageManager, _StorageManager);

  function LevelStorageManager(db) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, LevelStorageManager);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LevelStorageManager).call(this, db, options));
  }

  _createClass(LevelStorageManager, [{
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return this.loaded().then(function () {
        return new Promise(function (resolve, reject) {
          var delPromises = [];
          _this2._storage.createKeyStream().on('data', function (key) {
            delPromises.push(_this2.delete(key));
          }).on('end', function () {
            resolve(Promise.all(delPromises));
          });
        });
      });
    }
  }, {
    key: 'persist',
    value: function persist(key, value) {
      var _this3 = this;

      return this.loaded().then(function () {
        return new Promise(function (resolve, reject) {
          _this3._storage.put(key, _marsdb.EJSON.stringify(value), function (err) {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      var _this4 = this;

      return this.loaded().then(function () {
        return new Promise(function (resolve, reject) {
          _this4._storage.del(key, function (err) {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
        });
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this5 = this;

      return this.loaded().then(function () {
        return new Promise(function (resolve, reject) {
          _this5._storage.get(key, function (err, value) {
            if (value !== undefined) {
              resolve(_marsdb.EJSON.parse(value));
            } else {
              resolve(undefined);
            }
          });
        });
      });
    }
  }, {
    key: 'createReadStream',
    value: function createReadStream() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this._storage.createReadStream(options);
    }
  }, {
    key: '_loadStorage',
    value: function _loadStorage() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var dbName = _this6.db.modelName;
        var storageLocation = _this6.options.storageLocation || _defaultStorageLocation;
        var dbLocation = storageLocation + '/' + dbName;

        _mkdirp2.default.sync(dbLocation);

        if (!_stores[dbLocation]) {
          _stores[dbLocation] = (0, _levelup2.default)(dbLocation, _this6.options, function (err, db) {
            if (err) {
              reject(err);
            } else {
              _this6._storage = db;
              resolve();
            }
          });
        } else {
          _this6._storage = _stores[dbLocation];
          resolve();
        }
      });
    }
  }], [{
    key: 'defaultStorageLocation',
    value: function defaultStorageLocation() {
      if (arguments.length > 0) {
        _defaultStorageLocation = arguments[0];
      } else {
        return _defaultStorageLocation;
      }
    }
  }]);

  return LevelStorageManager;
})(_marsdb.StorageManager);

exports.default = LevelStorageManager;