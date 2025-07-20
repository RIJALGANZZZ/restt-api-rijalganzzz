const fetch = require("node-fetch")

async function gitClone(urls) {
    let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    try {
        let [, user, repo] = urls.match(regex) || []
        repo = repo.replace(/.git$/, '')
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`
        let headRes = await fetch(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'node-fetch'
            }
        })

        if (!headRes.ok) throw new Error(`GitHub API responded with status ${headRes.status}`)

        let disposition = headRes.headers.get('content-disposition')
        let filename = disposition
            ? disposition.match(/attachment; filename=(.*)/)[1]
            : `${repo}.zip`

        return {
            download: url,
            filename: filename
        }
    } catch (err) {
        throw new Error(`Failed to clone GitHub repo: ${err.message}`)
    }
}

module.exports = function (app) {
    app.get('/download/github', async (req, res) => {
        const { url } = req.query
        if (!url) {
            return res.json({ status: false, error: 'Url is required' })
        }
        try {
            const results = await gitClone(url)
            res.status(200).json({
                status: true,
                result: results
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            })
        }
    })
            }
