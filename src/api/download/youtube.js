module.exports = function (app) {
  const fetch = require('node-fetch')
  const cheerio = require('cheerio')
  const FormData = require('form-data')

  async function uploadToCatbox(buffer, filename = 'video.mp4') {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, filename)
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })
    if (!res.ok) throw new Error('Catbox upload failed')
    return await res.text()
  }

  async function getMp4LinkFromMp3Juice(url) {
    const videoId = url.split('v=')[1] || url.split('/').pop().replace('#', '')
    const target = `https://mp3juice.co/api/ajaxSearch/index?query=${videoId}`
    const res = await fetch(target, {
      headers: { 'x-requested-with': 'XMLHttpRequest' }
    })
    const json = await res.json()
    if (!json || !json.length) throw 'Video not found'

    const video = json[0]
    const html = await fetch(`https://mp3juice.co/api/ajaxFetch/index?id=${video.videoId}&title=${encodeURIComponent(video.title)}`)
      .then(res => res.text())

    const $ = cheerio.load(html)
    const mp4 = $('a:contains("MP4 Download")').attr('href')
    if (!mp4) throw 'MP4 link not found'

    return { title: video.title, thumb: video.thumb, mp4 }
  }

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, message: 'Missing url' })
      const { title, thumb, mp4 } = await getMp4LinkFromMp3Juice(url)
      const buffer = await fetch(mp4).then(r => r.buffer())
      const catboxUrl = await uploadToCatbox(buffer, `${title}.mp4`)
      res.json({ status: true, title, thumb, catboxUrl })
    } catch (e) {
      res.json({ status: false, message: e.message || e })
    }
  })
            }
