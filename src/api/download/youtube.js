const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3000

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return 'Unknown Duration'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} minute(s) ${secs} second(s)`
}

async function uploadToCatbox(buffer, filename = 'thumb.jpg') {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, filename)

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })

  if (!res.ok) throw new Error('Upload to Catbox failed')
  return await res.text()
}

app.get('/download/ytmp3', async (req, res) => {
  try {
    const { url } = req.query
    if (!url) return res.json({ status: false, message: 'Missing URL' })

    const ytId = url.split('v=')[1]?.substring(0, 11)
    const page = await axios.get(`https://y2mate.nu/en-hq8z/`)
    const $ = cheerio.load(page.data)

    const token = $('input[name="token"]').val()
    const response = await axios.post('https://y2mate.nu/api/ajaxSearch', {
      query: url
    })

    const result = response.data?.data?.audios?.[0]
    if (!result) throw new Error('Failed to fetch MP3')

    const thumbRes = await fetch(result.thumbnail)
    const thumbBuffer = await thumbRes.buffer()
    const catboxUrl = await uploadToCatbox(thumbBuffer)

    res.json({
      status: true,
      title: result.title,
      duration: formatDuration(result.duration),
      message: 'Audio is ready',
      tourl: catboxUrl,
      audio_url: result.url,
      creator: 'RijalGanzz'
    })
  } catch (e) {
    res.json({ status: false, message: e.message, creator: 'RijalGanzz' })
  }
})

app.get('/download/ytmp4', async (req, res) => {
  try {
    const { url } = req.query
    if (!url) return res.json({ status: false, message: 'Missing URL' })

    const ytId = url.split('v=')[1]?.substring(0, 11)
    const page = await axios.get(`https://y2mate.nu/en-hq8z/`)
    const $ = cheerio.load(page.data)

    const token = $('input[name="token"]').val()
    const response = await axios.post('https://y2mate.nu/api/ajaxSearch', {
      query: url
    })

    const result = response.data?.data?.videos?.[0]
    if (!result) throw new Error('Failed to fetch MP4')

    const thumbRes = await fetch(result.thumbnail)
    const thumbBuffer = await thumbRes.buffer()
    const catboxUrl = await uploadToCatbox(thumbBuffer)

    res.json({
      status: true,
      title: result.title,
      duration: formatDuration(result.duration),
      message: 'Video is ready',
      tourl: catboxUrl,
      video_url: result.url,
      creator: 'RijalGanzz'
    })
  } catch (e) {
    res.json({ status: false, message: e.message, creator: 'RijalGanzz' })
  }
})

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`)
})
