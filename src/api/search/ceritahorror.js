const axios = require('axios')
const cheerio = require('cheerio')

async function ceritahantu() {
    try {
        const response = await axios.get("https://cerita-hantu-nyata.blogspot.com/search?q=Kentang&m=1")
        const $ = cheerio.load(response.data)

        const stories = []
        $('.item-content').each((_, el) => {
            const title = $(el).find('.item-title a').text()
            const snippet = $(el).find('.item-snippet').text().trim()
            const image = $(el).find('.item-thumbnail img').attr('src')
            const url = $(el).find('.item-title a').attr('href')
            stories.push({ title, snippet, image, url })
        })

        return stories
    } catch (error) {
        throw error
    }
}

module.exports = function (app) {
    app.get('/search/ceritahantu', async (req, res) => {
        try {
            const results = await ceritahantu()
            res.status(200).json({
                status: true,
                result: results
            })
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`)
        }
    })
              }
