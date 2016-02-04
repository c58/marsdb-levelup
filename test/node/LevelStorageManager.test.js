import { Collection, EJSON } from 'marsdb';
import StorageManager from '../../lib/LevelStorageManager';
import chai, {expect, assert} from 'chai';
chai.use(require('chai-as-promised'));
chai.should();


describe('LevelStorageManager', () => {

  let db, localStorage;
  beforeEach(function () {
    StorageManager.defaultStorageLocation('./test/leveldb');
    db = new Collection('test', {storageManager: StorageManager});

    return Promise.all([
      db.storage.destroy(),
    ]);
  });

  describe('#destroy', function () {
    it('should destroy a whole collection everywhere', function () {
      return Promise.all([
        db.insert({a: 1, b: 2, _id: '1'}),
        db.insert({a: 2, b: 3, _id: '2'}),
        db.insert({a: 3, b: 4, _id: '3'}),
        db.insert({a: 4, b: 5, _id: '4'}),
        db.insert({a: 5, b: 6, _id: '5'}),
        db.insert({a: 6, b: 7, _id: '6'}),
      ]).then((ids) => {
        return Promise.all([
          db.storage.get('2').should.be.eventually.deep.equal({a: 2, b: 3, _id: '2'}),
          db.storage.get('1000').should.be.eventually.deep.equal(undefined),
        ]);
      }).then(() => {
        return db.storage.destroy();
      }).then(() => {
        return Promise.all([
          db.storage.get('2').should.not.be.eventually.deep.equal({a: 2, b: 3, _id: '2'}),
          db.storage.get('2').should.be.eventually.deep.equal(undefined),
        ]);
      });
    });
  });

  describe('#persist', function () {
    it('should persist on insert', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      });
    });

    it('should persist on insert multiple docs at once', function () {
      return db.insertAll([
        {a: 1, b: 2, _id: '1'},
        {a: 2, b: 2, _id: '2'},
        {a: 3, b: 2, _id: '3'},
      ]).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
          db.storage.get('2').should.be.eventually.deep.equal({a: 2, b: 2, _id: '2'}),
          db.storage.get('3').should.be.eventually.deep.equal({a: 3, b: 2, _id: '3'}),
          db.storage.get('4').should.be.eventually.deep.equal(undefined),
        ]);
      });
    });

    it('should persist on update', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return db.update('1', {$set: {a: 2}});
      }).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal({a: 2, b: 2, _id: '1'}),
        ]);
      });
    });
  });

  describe('#delete', function () {
    it('should delete from storage on remove', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      }).then(() => {
        return db.remove('1');
      }).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal(undefined),
          db.findOne('1').should.be.eventually.equal(undefined)
        ]);
      });
    });

    it('should have no errors on deleting non-existing key', function () {
      return db.insert({a: 1, b: 2, _id: '1'}).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal({a: 1, b: 2, _id: '1'}),
        ]);
      }).then(() => {
        return db.remove('1');
      }).then(() => {
        return Promise.all([
          db.storage.get('1').should.be.eventually.deep.equal(undefined),
          db.storage.delete('1')
        ]);
      });
    });
  });
});
