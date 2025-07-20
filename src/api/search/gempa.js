const fetch = require('node-fetch')

module.exports = function(app) {
    async function getGempaImage() {
        try {
            const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

            const data = await res.json()
            const imageUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/' + data.Shakemap
            const imgRes = await fetch(imageUrl)
            if (!imgRes.ok) throw new Error(`Image fetch error! Status: ${imgRes.status}`)

            return await imgRes.buffer()
        } catch (err) {
            throw err
        }
    }

    app.get('/search/gempa', async (req, res) => {
        try {
            const image = await getGempaImage()
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': image.length
            })
            res.end(image)
        } catch (err) {
            console.error(err)
            res.status(500).json({ status: false, message: err.message })
        }
    })
              }
