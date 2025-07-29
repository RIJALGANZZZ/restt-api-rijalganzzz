const axios = require('axios')

module.exports = function (app) {
  app.get('/search/ffplayer', async (req, res) => {
    const { nickname } = req.query
    if (!nickname) return res.status(400).json({ status: false, message: 'Parameter nickname diperlukan' })

    try {
      const { data } = await axios.get(`https://discordbot.freefirecommunity.com/search_player_api?nickname=${encodeURIComponent(nickname)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://www.freefirecommunity.com/ff-player-search/'
        }
      })

      if (data.error) return res.status(404).json({ status: false, message: data.error })

      const result = data.map((player, index) => ({
        no: index + 1,
        nickname: player.nickname,
        accountId: player.accountId,
        level: player.level,
        region: player.region,
        lastLogin: new Date(player.lastLogin * 1000).toLocaleDateString('id-ID')
      }))

      res.status(200).json({
        status: true,
        creator: 'Rijalganzz',
        searched: nickname,
        result
      })
    } catch (e) {
      res.status(500).json({ status: false, message: 'Internal error', error: e.message })
    }
  })
                                       }
