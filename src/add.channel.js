const DBClient = require('lib/dbclient')
const OAuth = require('lib/oauth')
const Youtube = require('module/youtube')

const app = async () => {
  const channelId = process.argv[2]
  if (!channelId) {
    console.log('channelId를 입력해주세요. 반드시 가장 처음의 파라메터로 입력해주셔야 합니다.')
    process.exit(1)
  }

  const dbClient = new DBClient()
  const { rows } = await dbClient.queryPromise('SELECT * FROM oauth_tokens LIMIT 1000')
  const oauthClient = new OAuth()
  let token = rows.filter(item => item.refresh_token)[0]
  token = await oauthClient.refreshAccessToken(token.access_token)
  const accessToken = token.access_token
  // const accessToken = 'ya29.Glx1B_Susm_MN_ZN88oQVXT4iVRSLOdW-6Zw9CnzgH1Yi-jDkOKd95qMLhe8hLw2hKBEYMxZoI1E7n4HJLVARJ91TrMFbRtzywp_9GMI7qM9cLr3tjJ_wfcGC7OJfg'
  console.log(accessToken)

  const youtube = new Youtube(accessToken)
  const channel = await youtube.getChannel(channelId)

  try {
    const attrs = ['channelId', 'status', 'title', 'keywords', 'description', 'country', 'commentCount', 'subscriberCount', 'videoCount', 'viewCount', 'publishedAt']
    const result = await dbClient.queryPromise(`
      INSERT INTO
       scrapper_channels(${attrs.join(', ')})
      VALUES(${attrs.map((_, i)=> `$${i + 1}`).join(', ')})
    `, attrs.map(v => channel[v]))

    console.log('잘 등록되었습니다')
    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}


app()