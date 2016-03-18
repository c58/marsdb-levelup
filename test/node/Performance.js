import { Collection, EJSON, Random } from 'marsdb';
import StorageManager from '../../lib/LevelStorageManager';
StorageManager.defaultStorageLocation('./test/leveldb');
Collection.defaultStorageManager(StorageManager);


describe('Performance tests', function () {
  describe('#insert', function () {
    it('should be fast', function () {
      const insertions = [];
      for (let i = 0; i < 1000; i++) {
        const posts = new Collection('posts');
        insertions.push(posts.insert(
          {
            string1: 'MarsDB' + '123',
            number1: new Date(),
            indexID: i
          }
        ));
      }
      return Promise.all(insertions);
    });
  });
});
