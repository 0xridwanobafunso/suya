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
        server: '[SERVER/SERVERS]',
        // memjs configs options - https://github.com/memcachier/memjs
        // some memjs options are overridden by suya. supported options are
        // {
        //   retries: 2,
        //   retry_delay: 0.2,
        //   failoverTime: 60,
        // }
        options: {},
      },
    },
    // whether suya should/shouldn't log to console. default to true
    logging: true,
  },
})

// This is a middleware to cache forever.
// Methods supported: GET
let cacheForever = Cache.forever()

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

app.get('/suya/memcached', cacheForever, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/suya/memcached', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

const server = app.listen(3000, () =>
  console.log('Server running at http://127.0.0.1:3000')
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
