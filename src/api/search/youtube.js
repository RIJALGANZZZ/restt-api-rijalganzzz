module.exports = function (app) {

app.get('/search/ytmp3', async (req, res) => {
    try {
        const { url } = req.query
        if (!url) return res.json({ status: false, error: 'Url is required' })

        const results = await global.fetchJson(`https://zenz.biz.id/downloader/ytmp3?url=${encodeURIComponent(url)}`)

        res.status(200).json({
            status: true,
            title: results.title,
            duration: results.duration,
            thumbnail: results.thumbnail,
            format: results.format,
            type: results.type,
            download_url: results.download_url,
            creator: results.creator
        })
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`)
    }
})

app.get('/search/ytmp4', async (req, res) => {
    try {
        const { url } = req.query
        if (!url) return res.json({ status: false, error: 'Url is required' })

        const results = await global.fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${url}&quality=720&server=auto`)

        res.status(200).json({
            status: true,
            result: results.result
        })
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`)
    }
})

}
