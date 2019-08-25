const queryString = require('query-string')
const { requestPromise } = require('lib/promise')
const _ = require('lodash')

const {
  YOUTUBE_API_DATA_V3,
} = process.env

const YOUTUBE_API_V3_CHANNELS = 'https://www.googleapis.com/youtube/v3/channels'
const YOUTUBE_API_V3_SEARCH = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_API_V3_VIDEOS = 'https://www.googleapis.com/youtube/v3/videos'
const YOUTUBE_API_V3_CAPTIONS = 'https://www.googleapis.com/youtube/v3/captions'

class YoutubeAPI {
  constructor(access_token) {
    this.access_token = access_token
  }



  async getVideoListFromChannel(channelId) {
    const qs = queryString.stringify({
      key: YOUTUBE_API_DATA_V3,
      part: 'id, snippet',
      channelId: channelId
    })

    try {
      const { body } = await this.requestToYoutube(`${YOUTUBE_API_V3_SEARCH}?${qs}`)
      const result = JSON.parse(body)
      return result
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  async getChannel(channelId) {
    const qs = queryString.stringify({
      key: YOUTUBE_API_DATA_V3,
      part: 'id, snippet, brandingSettings, contentDetails, invideoPromotion, statistics, topicDetails',
      id: channelId
    })

    try {
      const { body } = await this.requestToYoutube(`${YOUTUBE_API_V3_CHANNELS}?${qs}`)
      const result = JSON.parse(body)
      return result
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  async getVideo(videoId) {
    const qs = queryString.stringify({
      key: YOUTUBE_API_DATA_V3,
      part: 'id, snippet, contentDetails, liveStreamingDetails, recordingDetails, statistics, status, topicDetails',
      id: videoId
    })

    try {
      const { body } = await this.requestToYoutube(`${YOUTUBE_API_V3_VIDEOS}?${qs}`)
      const result = JSON.parse(body)
      return result
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  async getCaptions(videoId) {
    const qs = queryString.stringify({
      key: YOUTUBE_API_DATA_V3,
      part: 'id, snippet',
      videoId
    })

    try {
      const { body } = await this.requestToYoutube(`${YOUTUBE_API_V3_CAPTIONS}?${qs}`)
      const result = JSON.parse(body)
      return result
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  async getCaptionObject(caption_id) {
    const qs = queryString.stringify({
      key: YOUTUBE_API_DATA_V3,
    })

    try {
      let { body } = await this.requestToYoutube(`${YOUTUBE_API_V3_CAPTIONS}/${caption_id}?${qs}`)

      const timeRegexp = /[\d]*\:[\d]*\:[\d]*\.[\d]*\,[\d]*\:[\d]*\:[\d]*\.[\d]*/g
      const captionObject = {}
      let beforeTimestamp = ''
      body = body
        .split('\n')
        .filter(v => v)
        .forEach(v => {
          if (timeRegexp.test(v)) {
            captionObject[v] = []
            beforeTimestamp = v
          } else {
            captionObject[beforeTimestamp].push(v)
          }
        })
      Object.keys(captionObject)
        .forEach(key => { captionObject[key] = captionObject[key].join(' ') } )
      return captionObject
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  requestToYoutube (url, opt = {}) {
    const defaultOptions = {
      url,
      method : 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`
      }
    }
    const options = _.defaultsDeep(defaultOptions, opt)
    return requestPromise(options)
  }
}



module.exports = YoutubeAPI
