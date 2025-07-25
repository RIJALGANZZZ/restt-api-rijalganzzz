const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const router = express.Router()
const qs = require('querystring')

router.get('/download/ytmp3', async (req, res) => {
  const { url } = req.query
  if (!url) return res.json({ status: false, message: 'Missing url query' })

  try {
    const data = qs.stringify({ url, format: 'mp3', bitrate: '128' })
    const { data: html } = await axios.post('https://cnvmp3.com/api/ajaxSearch/index', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://cnvmp3.com',
        'Referer': 'https://cnvmp3.com/v25',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(html.result)
    const title = $('.video-title').text().trim() || 'No title'
    const download = $('.d-flex a.btn').attr('href')

    if (!download) throw new Error('Download link not found')

    res.json({ status: true, format: 'mp3', result: { title, url: download } })
  } catch (e) {
    res.json({ status: false, message: e.message })
  }
})

router.get('/download/ytmp4', async (req, res) => {
  const { url } = req.query
  if (!url) return res.json({ status: false, message: 'Missing url query' })

  try {
    const data = qs.stringify({ url, format: 'mp4', bitrate: '720' })
    const { data: html } = await axios.post('https://cnvmp3.com/api/ajaxSearch/index', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://cnvmp3.com',
        'Referer': 'https://cnvmp3.com/v25',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(html.result)
    const title = $('.video-title').text().trim() || 'No title'
    const download = $('.d-flex a.btn').attr('href')

    if (!download) throw new Error('Download link not found')

    res.json({ status: true, format: 'mp4', result: { title, url: download } })
  } catch (e) {
    res.json({ status: false, message: e.message })
  }
})

module.exports = router
