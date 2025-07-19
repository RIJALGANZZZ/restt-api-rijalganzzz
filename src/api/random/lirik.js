module.exports = function (app) {
app.get('/random/lirik', async (req, res) => {
    try {
        const { judul } = req.query;
        if (!judul) return res.json({ status: false, error: 'Judul lagu diperlukan' });

        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const cheerio = await import('cheerio');

        const searchRes = await fetch(`https://genius.com/api/search/multi?per_page=1&q=${encodeURIComponent(judul)}`);
        const searchData = await searchRes.json();

        const song = searchData.response.sections
            .flatMap(section => section.hits)
            .find(hit => hit.type === 'song');

        if (!song) return res.json({ status: false, error: 'Lagu tidak ditemukan' });

        const url = song.result.url;
        const html = await fetch(url).then(res => res.text());
        const $ = cheerio.load(html);
        const lyrics = $('div[data-lyrics-container="true"]').text().trim();

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
                url: url,
                lyrics: lyrics
            }
        });
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});
}
