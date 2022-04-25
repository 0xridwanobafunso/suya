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

app.get('/suya/node-cache', cacheForever, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

app.put('/suya/node-cache', resetCacheOnMutate, async (req, res, next) => {
  let users = await mockDB()

  res.status(200).json({
    success: true,
    data: {
      users,
    },
    code: 200,
  })
})

const server = app.listen(1000, () =>
  console.log('Server running at http://127.0.0.1:1000')
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
