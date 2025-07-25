const axios = require('axios')
const { parse } = require('node-html-parser')

module.exports = function (app) {
  const fetchDownload = async (url, format, bitrate) => {
    const form = new URLSearchParams({ url, format, bitrate })
    const { data } = await axios.post('https://cnvmp3.com/api/ajaxSearch/index', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://cnvmp3.com',
        'Referer': 'https://cnvmp3.com/v25',
        'User-Agent': 'Mozilla/5.0'
      }
    })
    const html = parse(data.result)
    return {
      title: html.querySelector('.video-title')?.innerText || 'No title',
      url: html.querySelector('.d-flex a.btn')?.getAttribute('href') || null
    }
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Missing url' })
      const result = await fetchDownload(url, 'mp3', '128')
      if (!result.url) throw 'Download link not found'
      res.json({ status: true, result })
    } catch (e) {
      res.json({ status: false, message: e.message || e })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Missing url' })
      const result = await fetchDownload(url, 'mp4', '720')
      if (!result.url) throw 'Download link not found'
      res.json({ status: true, result })
    } catch (e) {
      res.json({ status: false, message: e.message || e })
    }
  })
}
