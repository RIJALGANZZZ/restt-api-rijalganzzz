const fetch = require('node-fetch')

module.exports = function(app) {
    async function anim() {
        try {
            const type = ["blowjob", "neko", "trap", "waifu"]
            const rn = type[Math.floor(Math.random() * type.length)]
            const data = await fetch(`https://api.waifu.pics/nsfw/${rn}`).then(res => res.json())
            const imageBuffer = await fetch(data.url).then(res => res.buffer())
            return imageBuffer
        } catch (error) {
            throw error
        }
    }

    app.get('/random/nsfw', async (req, res) => {
        try {
            const image = await anim()
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
            })
            res.end(image)
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`)
        }
    })
}
