const fetch = require('node-fetch')

module.exports = function(app) {
    async function anim() {
        try {
            const type = ["blowjob", "neko", "trap", "waifu"]
            const rn = type[Math.floor(Math.random() * type.length)]
            const response = await fetch(`https://api.waifu.pics/nsfw/${rn}`)

            if (!response.ok) throw new Error(`API error! Status: ${response.status}`)

            const data = await response.json()

            const imgRes = await fetch(data.url)
            if (!imgRes.ok) throw new Error(`Image fetch error! Status: ${imgRes.status}`)

            const imageBuffer = await imgRes.buffer()
            return imageBuffer
        } catch (err) {
            throw err
        }
    }

    app.get('/random/random-nsfw', async (req, res) => {
        try {
            const image = await anim()
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
            })
            res.end(image)
        } catch (err) {
            console.error(err)
            res.status(500).json({ status: false, message: err.message })
        }
    })
                }
