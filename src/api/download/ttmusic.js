const fetch = require('node-fetch')

module.exports = function (app) {
  app.get('/download/ttmusic', async (req, res) => {
    const { url } = req.query
    if (!url) return res.status(400).json({ status: false, message: 'Parameter url kosong' })

    try {
      const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.tikwm.com/',
          'Origin': 'https://www.tikwm.com'
        }
      })

      const data = await apiRes.json()

      if (!data?.data?.music || !data?.data?.music_info)
        return res.status(500).json({ status: false, message: 'Gagal ambil data musik dari TikTok' })

      const result = {
        id: data.data.music_info.id,
        title: data.data.music_info.title,
        author: data.data.author.nickname,
        url: `https://www.tikwm.com${data.data.music}`
      }

      res.status(200).json({ status: true, creator: 'Rijalganzz', result })
    } catch (e) {
      res.status(500).json({ status: false, message: 'Internal error', error: e.message })
    }
  })
}
