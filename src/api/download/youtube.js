module.exports = function (app) {
  const ytdl = require('ytdl-core')
  const ffmpeg = require('fluent-ffmpeg')
  const stream = require('stream')
  const FormData = require('form-data')
  const fetch = require('node-fetch')

  function formatDuration(sec) {
    if (!sec) return 'Durasi tidak diketahui'
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
    return `${m} menit ${s} detik`
  }

  async function uploadToCatbox(buffer, filename = 'thumb.jpg') {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, filename)
    const r = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })
    if (!r.ok) throw new Error('Catbox upload failed')
    return r.text()
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url || !ytdl.validateURL(url))
        return res.status(400).json({ status: false, message: 'URL YouTube tidak valid' })

      const info = await ytdl.getInfo(url)
      const title = info.videoDetails.title
      const sec = parseInt(info.videoDetails.lengthSeconds)
      const duration = formatDuration(sec)
      const thumbUrl = info.videoDetails.thumbnails.pop().url
      const thumbRes = await fetch(thumbUrl)
      const thumbBuf = await thumbRes.buffer()
      const tourl = await uploadToCatbox(thumbBuf)

      // buat stream mp3 via ffmpeg
      const passthrough = new stream.PassThrough()
      ffmpeg(ytdl(url, { quality: 'highestaudio' }))
        .audioBitrate(128)
        .format('mp3')
        .pipe(passthrough)

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${title}.mp3"`
      })
      // kirim metadata dulu, lalu audio
      res.write(JSON.stringify({ status: true, title, duration, tourl }) + '\n')
      passthrough.pipe(res)
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url || !ytdl.validateURL(url))
        return res.status(400).json({ status: false, message: 'URL YouTube tidak valid' })

      const info = await ytdl.getInfo(url)
      const title = info.videoDetails.title
      const sec = parseInt(info.videoDetails.lengthSeconds)
      const duration = formatDuration(sec)
      const thumbUrl = info.videoDetails.thumbnails.pop().url
      const thumbRes = await fetch(thumbUrl)
      const thumbBuf = await thumbRes.buffer()
      const tourl = await uploadToCatbox(thumbBuf)

      const streamVideo = ytdl(url, { quality: 'highestvideo' })
      res.set({
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${title}.mp4"`
      })
      res.write(JSON.stringify({ status: true, title, duration, quality: 'Auto', tourl }) + '\n')
      streamVideo.pipe(res)
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
             }
