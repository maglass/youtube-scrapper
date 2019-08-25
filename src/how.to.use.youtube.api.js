const DBClient = require('lib/dbclient')
const OAuth = require('lib/oauth')
const Youtube = require('module/youtube')

async function app () {
  const dbClient = new DBClient()
  const oauthClient = new OAuth()
  const { rows } = await dbClient.queryPromise('SELECT * FROM oauth_tokens LIMIT 1000')
  let token = rows.filter(item => item.refresh_token)[0]
  token = await oauthClient.refreshAccessToken(token.access_token)
  const accessToken = token.access_token
  console.log(accessToken)

  // 채널 하나 잡고
  // 1. 채널정보 갱신 [channel]
  // 2. 해당 채널의 모든 영상 id 갱신  [video]
  // 3. 각각 영상 id 에 대한 정보 획득하기 [video]
  // 4. 영상 id정보 획득하면서 동시에 captionId획득 [caption]
  // 5. caption정보 획득 [caption]

  const youtube = new Youtube(accessToken)

  const channelInfo = await youtube.getChannel('UCdtRAcd3L_UpV4tMXCw63NQ')
  // console.log(channelInfo)
  console.log(JSON.stringify(channelInfo))

  const videoList = await youtube.getVideoListFromChannel('UCdtRAcd3L_UpV4tMXCw63NQ')
  // console.log(videoList)
  console.log(JSON.stringify(videoList))

  const video = await youtube.getVideo('SKilLXN_isw') // 자막 없는녀석
  // const video = await youtube.getVideo('40dJS_LC6S8') // 자막 있는녀석
  // console.log(video)
  console.log(JSON.stringify(video))

  const captions = await youtube.getCaptions('SKilLXN_isw') // 자막 없는녀석 한국말
  // const captions = await youtube.getCaptions('40dJS_LC6S8') // 자막 있는녀석 외국말
  // console.log(captions)
  console.log(JSON.stringify(captions))

  const downloadCaption = await youtube.getCaptionObject('UIiUWVPvyby5kSDfusul30TsRbEVXN5fTeTtehtgMqo=') // 자막 없는녀석의 자동 한글 자막
  // const downloadCaption = await youtube.getCaptionObject('4TDrrCVZYdY0fELrxbuSvNX3OiTMoM9N') // 자막 있는녀석의 외국말인데 한글 번역 자막
  console.log(downloadCaption)

  process.exit(0)
}

/*
CREATE TABLE

*/

app()
