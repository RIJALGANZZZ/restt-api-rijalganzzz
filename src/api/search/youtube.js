const express = require('express')
const setting = require('./src/setting.json')

module.exports = function (app) {
  app.get('/search/ytmp3', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: 'Url is required' })

      const result = await global.fetchJson(`https://zenz.biz.id/downloader/ytmp3?url=${encodeURIComponent(url)}`)
      res.json({
        status: true,
        creator: setting.apiSettings.creator,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        type: result.type,
        format: result.format,
        download_url: result.download_url
      })
    } catch (e) {
      res.status(500).send(`Error: ${e.message}`)
    }
  })

  app.get('/search/ytmp4', async (req, res) => {
    try {
      const { url } = req.query
      if (!url) return res.json({ status: false, error: 'Url is required' })

      const result = await global.fetchJson(`https://zenz.biz.id/downloader/ytmp4?url=${encodeURIComponent(url)}`)
      res.json({
        status: true,
        creator: setting.apiSettings.creator,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        type: result.type,
        quality: result.quality,
        download_url: result.download_url
      })
    } catch (e) {
      res.status(500).send(`Error: ${e.message}`)
    }
  })
}
