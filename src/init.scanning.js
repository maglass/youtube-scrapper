/**
 * @Title 최초에 등록한 유투브 채널들을 전부 스캔해옵니다.
 * @Description 데이터베이스에 등록된 channel_id 들을 이용하여 captionObject까지의 모든 정보들을 받아올 수 있도록 합니다.
 */
const DBClient = require('lib/dbclient')
const OAuth = require('lib/oauth')
const Youtube = require('module/youtube')
const snooze = require('lib/snooze')

const app = async () => {
  const dbClient = new DBClient()
  const oauthClient = new OAuth()
  const { rows: tokensRows } = await dbClient.queryPromise('SELECT * FROM oauth_tokens LIMIT 1000')
  let token = tokensRows.filter(item => item.refresh_token)[0]
  token = await oauthClient.refreshAccessToken(token.access_token)
  const accessToken = token.access_token

  const { rows: channelsRows } = await dbClient.queryPromise('SELECT * FROM scrapper_channels LIMIT 1000')

  const youtube = new Youtube(accessToken)
  for (let channelIndex = 0; channelIndex < channelsRows.length; channelIndex += 1) {
    const channel = channelsRows[channelIndex]

    let token = ''
    let first = true
    while (token || first) {
      first = false
      let {
        pageInfo: { totalResults, resultsPerPage },
        nextPageToken,
        items: videoList,
      } = await youtube.getVideoListFromChannel(channel.channelid, token)
      token = nextPageToken
      console.log(totalResults, resultsPerPage, token, videoList)

      await snooze(1000)
      
    }
  }


  process.exit(0)
}


app()