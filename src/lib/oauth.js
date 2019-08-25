const queryString = require('query-string')
const { requestPromise } = require('lib/promise')

const {
  OAUTH_MAGLASS_API,
} = process.env

class MaglassOAuth {
  async refreshAccessToken(access_token) {
    const options = {
      method: 'GET',
      url: `${OAUTH_MAGLASS_API}/refresh?${queryString.stringify({ access_token })}`,
    }
    const { body } = await requestPromise(options)
    return JSON.parse(body)
  }
}


module.exports = MaglassOAuth
