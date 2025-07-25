module.exports = function (app) {
  const fetch = require('node-fetch')
  const cheerio = require('cheerio')

  async function y2mateDl(url, type = 'mp3') {
    const res = await fetch('https://y2mate.nu/en-hq8z/', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0'
      },
      body: new URLSearchParams({ url })
    })

    const html = await res.text()
    const $ = cheerio.load(html)
    const title = $('input[name="title"]').val() || $('title').text()
    const thumb = $('.video-thumb img').attr('src')
    let downloadUrl, quality, size

    $('a').each((i, el) => {
      const text = $(el).text().trim().toLowerCase()
      if (type === 'mp3' && text.includes('mp3')) downloadUrl = $(el).attr('href')
      if (type === 'mp4' && text.includes('mp4')) downloadUrl = $(el).attr('href')
    })

    if (!downloadUrl) throw 'Download link not found'
    return { status: true, title, thumb, type, downloadUrl }
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Missing url parameter' })
      const data = await y2mateDl(url, 'mp3')
      res.json(data)
    } catch (e) {
      res.json({ status: false, message: e.message || e })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Missing url parameter' })
      const data = await y2mateDl(url, 'mp4')
      res.json(data)
    } catch (e) {
      res.json({ status: false, message: e.message || e })
    }
  })
  }
