## Tests

All the benchmark test suites are written with [Jest](https://jestjs.io) and [Axios](https://www.npmjs.com/package/axios).

### Benchmarks tests

#### Nodecache

```sh
# terminal tab 1
# clone root repo
$ git clone [repo_url]

# install dependencies
$ npm i

# start benchmark server
$ npm run start:benchmark:server:node-cache

## ~OUTPUT
## [NODECACHE] Server running at http://localhost:1000

# terminal tab 2
$ npm run benchmark:node-cache

## ~RESULT ON MY MACHINE
#  PASS  tests/benchmarks/node-cache.test.ts (42.591 s)
#    The performance of suya with node-cache
#      √ if there is any performance increase when using node-cache (9106 ms)

#  Test Suites: 1 passed, 1 total
#  Tests:       1 passed, 1 total
#  Snapshots:   0 total
#  Time:        46.997 s
```

#### Redis

```sh
# terminal tab 1
# clone root repo
$ git clone [repo_url]

# install dependencies
$ npm i

# open tests/benchmarks/servers/redis.ts file and update your redis server credentials
# start benchmark server
$ npm run start:benchmark:server:redis

## ~OUTPUT
## [REDIS] Server running at http://localhost:2000
## -----------------------------------------------
## [REDIS] Suya connected to redis successfully!!!
## -----------------------------------------------

# terminal tab 2
$ npm run benchmark:redis

## ~RESULT ON MY MACHINE
#  PASS  tests/benchmarks/redis.test.ts (27.956 s)
#    The performance of suya with redis
#      √ if there is any performance increase when using redis (13092 ms)

#  Test Suites: 1 passed, 1 total
#  Tests:       1 passed, 1 total
#  Snapshots:   0 total
#  Time:        29.912 s
```

#### Memcached

```sh
# terminal tab 1
# clone root repo
$ git clone [repo_url]

# install dependencies
$ npm i

# open tests/benchmarks/servers/memcached.ts file and update your memcached server credentials
# start benchmark server
$ npm run start:benchmark:server:memcached

## ~OUTPUT
## [MEMCACHED] Server running at http://localhost:3000
## -------------------------------------------------------
## [MEMCACHED] Suya connected to memcached successfully!!!
## -------------------------------------------------------

# terminal tab 2
$ npm run benchmark:memcached

## ~RESULT ON MY MACHINE
#  PASS  tests/benchmarks/memcached.test.ts (27.956 s)
#    The performance of suya with memcached
#      √ if there is any performance increase when using memcached (12073 ms)

#  Test Suites: 1 passed, 1 total
#  Tests:       1 passed, 1 total
#  Snapshots:   0 total
#  Time:        28.715 s
```
