# Suya, a Simple, Fast Cache Middleware(s) for Express ⚡

![Suya](https://github.com/0xridwanobafunso/suya/blob/main/SUYA.gif?raw=true 'Suya Library')

[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/0xridwanobafunso/suya)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[//]: # [![Actions Status](https://github.com/ridwanobafunso/suya/workflows/format,%20lint,%20build%20and%20publish/badge.svg)](https://github.com/0xridwanobafunso/suya/actions) 
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/0xridwanobafunso/suya)
[![Node version](https://img.shields.io/node/v/suya.svg?style=flat)](http://nodejs.org/download/)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/0xridwanobafunso/suya/blob/main/CONTRIBUTING.md)
[![GitHub contributors](https://img.shields.io/github/contributors/0xridwanobafunso/suya.svg?style=flat)](https://github.com/0xridwanobafunso/suya)

## Introduction

Suya is an express middleware(s) that adds caching layer on top of your express API response to reduce latency and improve API performance.

## Installation

```sh
 # through npm
 $ npm i suya
```

```sh
 # through yarn
 $ yarn add suya
```

## Features

1. Lightweight Library.
2. Simple API.
3. Typescript Support.
4. Many Cache Engines Support.
5. Nice Terminal Logging.

## Usage

To begin, you would need a cache/in memory store such as [Redis](https://redis.io), or [Memcached](https://memcached.org) installed on your machine or alternatively using NodeJS Internal Caching.
If you want to quickly get up and running without installing Redis or Memcached on your machine. I highly recommend using managed cloud services like [RedisLabs](https://redislabs.com) (redis) or [Memcachier](https://memcachier.com) (memcached). No worries, they both have **free plan with 25MB storage** with no credit card required.

### NodeJS Internal Caching

```js
const express = require('express')
const { Suya } = require('suya')

const app = express()

const Cache = new Suya({
  engine: {
    name: 'node-cache',
  },
})

// This is a middleware to cache forever.
// Methods supported: GET
let cacheForever = Cache.forever()

// This is a middleware to cache for a specific seconds.
// Methods supported: GET
let cacheWithDuration = Cache.duration(50)

// This is a middleware to reset cache on mutation.
// Methods supported: POST, PUT, PATCH, DELETE
let resetCacheOnMutate = Cache.resetOnMutate({
  indicator: {
    success: true,
  },
})

let mockDB = () => {
  let users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@domain.com',
    },
    {
      id: 2,
      name: 'James Noah',
      email: 'noah@domain.com',
    },
  ]

  // mocking response time to be between 100ms - 600ms
  let randResponseTime = Math.floor(Math.random() * 6 + 1) * 100

  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(users)
    }, randResponseTime)
  })
}

app.get('/users/forever', cacheForever, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/forever', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.get('/users/duration', cacheWithDuration, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/duration', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

const server = app.listen(2000, () =>
  console.log('Server running at http://127.0.0.1:2000')
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)

  // close the server
  server.close(async () => {
    // close connection
    await Cache.close()

    process.exit(1)
  })
})
```

### Redis

```js
const express = require('express')
const { Suya } = require('suya')

const app = express()

const Cache = new Suya({
  engine: {
    name: 'redis',
    configs: {
      redis: {
        // node-redis configs options.
        // https://github.com/NodeRedis/node-redis#options-object-properties
        options: {
          host: '127.0.0.1', // Redis host
          port: 6379, // Redis port
          password: '[pass]', // Redis password
          family: 4, // 4 (IPv4) or 6 (IPv6)
          db: 0, // Redis database
        },
      },
    },
    // whether suya should/shouldn't log to console
    logging: true,
  },
})

// This is a middleware to cache forever.
// Methods supported: GET
let cacheForever = Cache.forever()

// This is a middleware to cache for a specific seconds.
// Methods supported: GET
let cacheWithDuration = Cache.duration(50)

// This is a middleware to reset cache on mutation.
// Methods supported: POST, PUT, PATCH, DELETE
let resetCacheOnMutate = Cache.resetOnMutate({
  indicator: {
    success: true,
  },
})

let mockDB = () => {
  let users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@domain.com',
    },
    {
      id: 2,
      name: 'James Noah',
      email: 'noah@domain.com',
    },
  ]

  // mocking response time to be between 100ms - 600ms
  let randResponseTime = Math.floor(Math.random() * 6 + 1) * 100

  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(users)
    }, randResponseTime)
  })
}

app.get('/users/forever', cacheForever, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/forever', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.get('/users/duration', cacheWithDuration, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/duration', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

const server = app.listen(2000, () =>
  console.log('Server running at http://127.0.0.1:2000')
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)

  // close the server
  server.close(async () => {
    // close connection
    await Cache.close()

    process.exit(1)
  })
})
```

### Memcached

```js
const express = require('express')
const { Suya } = require('suya')

const app = express()

const Cache = new Suya({
  engine: {
    name: 'memcached',
    configs: {
      memcached: {
        // server string format e.g
        // single server        - user:pass@server1:11211
        // multiple servers     - user:pass@server1:11211,user:pass@server2:11211
        server: 'johndoe:1Mx4rGj0r@127.0.0.1:11211', // local memcached server
        // memjs configs options - https://github.com/memcachier/memjs
        // some memjs options are overridden by suya. supported options are
        // {
        //   retries: 2,
        //   retry_delay: 0.2,
        //   failoverTime: 60,
        // }
        options: {
          retries: 2,
          retry_delay: 0.2,
          failoverTime: 60,
        },
      },
    },
    // whether suya should/shouldn't log to console
    logging: true,
  },
})

// This is a middleware to cache forever.
// Methods supported: GET
let cacheForever = Cache.forever()

// This is a middleware to cache for a specific seconds.
// Methods supported: GET
let cacheWithDuration = Cache.duration(50)

// This is a middleware to reset cache on mutation.
// Methods supported: POST, PUT, PATCH, DELETE
let resetCacheOnMutate = Cache.resetOnMutate({
  indicator: {
    success: true,
  },
})

let mockDB = () => {
  let users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@domain.com',
    },
    {
      id: 2,
      name: 'James Noah',
      email: 'noah@domain.com',
    },
  ]

  // mocking response time to be between 100ms - 600ms
  let randResponseTime = Math.floor(Math.random() * 6 + 1) * 100

  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(users)
    }, randResponseTime)
  })
}

app.get('/users/forever', cacheForever, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/forever', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.get('/users/duration', cacheWithDuration, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/users/duration', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  // res.status(400).json({
  //   // once the indicator set on .resetOnMutate({}) middleware doesn't match
  //   // like so, the data remain cached.
  //   success: false,
  //   error: {
  //     message: 'Email address is required!',
  //   },
  //   code: 400,
  // })

  res.status(200).json({
    // once the indicator set on .resetOnMutate({}) middleware match like so,
    // the cached data would get cleared it out.
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

const server = app.listen(2000, () =>
  console.log('Server running at http://127.0.0.1:2000')
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)

  // close the server
  server.close(async () => {
    // close connection
    await Cache.close()

    process.exit(1)
  })
})
```

## API

1. `let Cache = new Suya({ engine: { name: [name], configs: { [configs] }, logging: [boolean] } })`

- `[name]` - the name of the in memory engine to use.
  e.g name: 'node-cache' | 'redis' | 'memcached'
- `[configs]` - the configurations for the selected engine. e.g

       // For Node-Cache
       // there's no configurations for node-cache

       // For Redis
       configs: {
         redis: {
            options: {
              // node-redis configurations options
              // https://github.com/NodeRedis/node-redis#options-object-properties
            },
         }
       }

       // For Memcached
       configs: {
         memcached: {
            // server string format e.g
            // single server        - user:pass@server1:11211
            // multiple servers     - user:pass@server1:11211,user:pass@server2:11211
            server: '',
            // memjs configs options - https://github.com/memcachier/memjs
            // some memjs options are overridden by suya. supported options are
            // {
            //   retries: 2,
            //   retry_delay: 0.2,
            //   failoverTime: 60,
            // }
            options: {},
         }
       }

- `[logging]` - whether suya should/shouldn't log to console
  e.g logging: true | false. Default to **true**.

2. `Cache.forever()` - midddleware to cache forever. Method supported: **GET**.

3. `Cache.duration([n])` - midddleware to cache for a specific duration (i.e **time to live** in cache engine) where [n] is the duration in seconds. Method supported: **GET**.

4. `Cache.resetOnMutate({ indicator: { [key]: [value] } })` - midddleware to reset cache on a successful mutation where [key] and [value] can be any indicator on successful mutation. e.g { success: true }. Method supported: **POST, PUT, PATCH, DELETE**.

5. `Cache.close()` - this is **NOT** a middleware, its just a helper method to close open connections.

## Error Handling

Suya extends the global Error class. Some errors could be handle through express middleware like so:

```js
// global express error handler
app.use((err, req, res, next) => {
  if (err.name == 'SuyaError') {
    return res.status(500).json({
      success: false,
      error: {
        message: err.message,
      },
    })
  }
})
```

**NB:** Some errors occur during the initializations of suya object and these errors are thrown when developers don't follow typescript compiler/rules according to suya types definition. These errors are been underlined during the development but the developer ignores them.

## Tips

1. `.forever()` middleware should be use when your data dont change often and use `.resetOnMutate({ indicator: { [key]: [value] } })` to make it upto date on every mutation (POST, PUT, PATCH, DELETE).
2. `.duration([n])` middleware should be use when you are dealing with real time data (data that change often) and **don't use `.resetOnMutate({ indicator: { [key]: [value] } })`** on mutation at all because using will clear up the cache on every mutation (POST, PUT, PATCH, DELETE) hence no performance improvement because the data is **real time**. `.duration([n])` only would get the cache cleared out as the duration elapse.
3. `.close()` helper method should be use when node proccess crashes unexpectedly to close open connections to any external resources.

## Contributors

Many thanks to all our contributors that helps to add core APIs to **suya**. I say a **BIG** thank you.

1. [Obafunso Ridwan Adebayo](https://github.com/ridwanobafunso)

Contributions are welcome. Check [CONTRIBUTING.md](https://github.com/ridwanobafunso/suya/blob/latest-v1.0.0/CONTRIBUTING.md).

## Tests

All the benchmark test suites are written with [Jest](https://jestjs.io) and [Axios](https://www.npmjs.com/package/axios).

### Benchmarks tests

#### Nodecache

```sh
# terminal tab 1
# clone repo
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
# clone repo
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
# clone repo
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

## Changelog

- v1.0.3 - Improve documentation and remove dependencies that has it own types built-in i.e @types/colors and @types/node-cache. Created new release with v1.0.3 tag
- v1.0.2 - Fix bugs of throwing SuyaError in middleware(s) instead of passing the error to the next middleware in the cycle. Created new release with v1.0.2 tag
- v1.0.1 - Created new release with v1.0.1 tag which triggered Github Actions workflows to format, lint, build and re-publish the library. **v1.0.1** is the **initial release**.
- v1.0.0 - Unpublished v1.0.0 from npm due to some errors, and remove v1.0.0 releases and tags from this repo.
- v1.0.0 - Commit all source codes, then I release v1.0.0 tag which triggered Github Actions workflows to format, lint, build and publish the library.

## Versioning

I use [SemVer](https://semver.org) for versioning.

## License

### MIT License

Copyright (c) 2020 <obafunsoadebayo17@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
