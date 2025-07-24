module.exports = function (app) {
  const ytdl = require('ytdl-core')
  const fetch = require('node-fetch')
  const FormData = require('form-data')

  function formatDuration(sec) {
    if (!sec) return 'Durasi tidak diketahui'
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
    return `${m} menit ${s} detik`
  }

  async function uploadToCatbox(buffer, filename = 'thumb.jpg') {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, filename)
    const r = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
    if (!r.ok) throw new Error('Catbox upload failed')
    return r.text()
  }

  app.get('/download/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url || !ytdl.validateURL(url)) return res.json({ status: false, message: 'URL tidak valid' })

      const info = await ytdl.getInfo(url)
      const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
      const title = info.videoDetails.title
      const duration = formatDuration(parseInt(info.videoDetails.lengthSeconds))
      const thumbnail = info.videoDetails.thumbnails.pop().url
      const thumbBuffer = await (await fetch(thumbnail)).buffer()
      const tourl = await uploadToCatbox(thumbBuffer)

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title,
        duration,
        message: `🎵 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n\n*Sedang Mengirim Audio...*`,
        tourl,
        audio_url: audioFormat.url
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })

  app.get('/download/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url || !ytdl.validateURL(url)) return res.json({ status: false, message: 'URL tidak valid' })

      const info = await ytdl.getInfo(url)
      const videoFormat = ytdl.chooseFormat(info.formats, { quality: '18' }) // mp4 360p biasanya
      const title = info.videoDetails.title
      const duration = formatDuration(parseInt(info.videoDetails.lengthSeconds))
      const quality = videoFormat.qualityLabel
      const thumbnail = info.videoDetails.thumbnails.pop().url
      const thumbBuffer = await (await fetch(thumbnail)).buffer()
      const tourl = await uploadToCatbox(thumbBuffer)

      res.json({
        status: true,
        creator: 'RijalGanzz',
        title,
        duration,
        quality,
        message: `🎬 *Judul:* ${title}\n⏰ *Durasi:* ${duration}\n📽️ *Kualitas:* ${quality}\n\n*Sedang Mengirim Video...*`,
        tourl,
        video_url: videoFormat.url
      })
    } catch (e) {
      res.status(500).json({ status: false, message: e.message })
    }
  })
                                 }
