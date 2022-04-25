import axios from 'axios'

describe('The performance of suya with node-cache', () => {
  test('if there is any performance increase when using node-cache', async (done) => {
    let url = 'http://127.0.0.1:1000'
    let totalRequest: number = 20
    let totalResponseTime: number = 0
    let responseTimeInArray: string[] = []

    /**
     *  with node-cache
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-with-node-cache`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time with node-cache
    let averageResponseTimeWithNodecache = totalResponseTime / totalRequest
    // // response time of all request with node-cache
    // console.log(
    //   '[NODECACHE]: Response Time With Nodecache - ',
    //   responseTimeInArray
    // )

    totalResponseTime = 0
    responseTimeInArray = []

    /**
     *  without node-cache
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-without-node-cache`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time without node-cache
    let averageResponseTimeWithoutNodecache = totalResponseTime / totalRequest
    // // response time of all request without node-cache
    // console.log(
    //   '[NODECACHE]: Response Time Without Nodecache - ',
    //   responseTimeInArray
    // )

    totalResponseTime = 0
    responseTimeInArray = []

    expect(averageResponseTimeWithNodecache).toBeLessThan(
      averageResponseTimeWithoutNodecache
    )

    done()
  })
})
