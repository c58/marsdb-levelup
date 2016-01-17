MarsDB-LevelUP
=========

[![Build Status](https://travis-ci.org/c58/marsdb-levelup.svg?branch=master)](https://travis-ci.org/c58/marsdb-levelup)
[![npm version](https://badge.fury.io/js/marsdb-levelup.svg)](https://www.npmjs.com/package/marsdb-levelup)
[![Dependency Status](https://david-dm.org/c58/marsdb-levelup.svg)](https://david-dm.org/c58/marsdb-levelup)

[MarsDB](https://github.com/c58/marsdb) storage implementation for [LevelUP](https://github.com/Level/levelup).

## Usage
```javascript
import Collection from ‘marsdb’;
import LevelStorageManager from 'marsdb-levelup';

// Setup different storage managers
Collection.defaultStorageManager(LevelStorageManager);

const users = new Collection(‘users’);
```

## Contributing
I’m waiting for your pull requests and issues.
Don’t forget to execute `gulp lint` before requesting. Accepted only requests without errors.

## License
See [License](LICENSE)