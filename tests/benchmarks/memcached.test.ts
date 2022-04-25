import axios from 'axios'

describe('The performance of suya with memcached', () => {
  test('if there is any performance increase when using memcached', async (done) => {
    let url = 'http://127.0.0.1:3000'
    let totalRequest: number = 20
    let totalResponseTime: number = 0
    let responseTimeInArray: string[] = []

    /**
     *  with memcached
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-with-memcached`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time with memcached
    let averageResponseTimeWithMemcached = totalResponseTime / totalRequest
    // // response time of all request with memcached
    // console.log(
    //   '[MEMCACHED]: Response Time With Memcached - ',
    //   responseTimeInArray
    // )

    totalResponseTime = 0
    responseTimeInArray = []

    /**
     *  without memcached
     */
    for (let i = 1; i <= totalRequest; i++) {
      let { headers } = await axios.get(`${url}/users-without-memcached`)

      responseTimeInArray.push(headers['x-response-time'])
      totalResponseTime += parseFloat(headers['x-response-time'].split('ms')[0])
    }

    // average response time without memcached
    let averageResponseTimeWithoutMemcached = totalResponseTime / totalRequest
    // // response time of all request without memcached
    // console.log(
    //   '[MEMCACHED]: Response Time Without Memcached - ',
    //   responseTimeInArray
    // )

    totalResponseTime = 0
    responseTimeInArray = []

    expect(averageResponseTimeWithMemcached).toBeLessThan(
      averageResponseTimeWithoutMemcached
    )

    done()
  })
})
