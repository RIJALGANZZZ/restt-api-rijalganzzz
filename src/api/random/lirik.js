const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = async (req, res) => {
  const { judul } = req.query
  if (!judul) return res.status(400).json({ status: false, message: 'Masukkan judul lagu di query ?judul=' })

  try {
    const search = await fetch(`https://genius.com/api/search/multi?per_page=1&q=${encodeURIComponent(judul)}`)
    const json = await search.json()

    const song = json.response.sections
      .flatMap(section => section.hits)
      .find(hit => hit.type === 'song')

    if (!song) return res.status(404).json({ status: false, message: 'Lagu tidak ditemukan' })

    const html = await fetch(song.result.url).then(r => r.text())
    const $ = cheerio.load(html)
    const lyrics = $('div[data-lyrics-container="true"]').text().trim()

    res.status(200).json({
      status: true,
      creator: 'RijalGanzz',
      result: {
        title: song.result.title,
        fullTitle: song.result.full_title,
        artist: song.result.primary_artist.name,
        artistUrl: song.result.primary_artist.url,
        id: song.result.id,
        endpoint: `/songs/${song.result.id}`,
        instrumental: false,
        image: song.result.song_art_image_url,
        url: song.result.url,
        lyrics
      }
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Gagal mengambil lirik', error: err.message })
  }
                          }
