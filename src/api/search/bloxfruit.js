const axios = require('axios')
const cheerio = require('cheerio')

module.exports = function(app) {
  const emojiMap = {
    'Phoenix': '🕊️',
    'Magma': '🌋',
    'Dark': '🌘',
    'Spring': '🌀',
    'Blade': '🗡️',
    'Dragon': '🐉',
    'Dough': '🍩',
    'Leopard': '🐆',
    'Spirit': '👻',
    'Venom': '☠️',
    'Shadow': '🌑',
    'Blizzard': '🌨️',
    'Buddha': '🧘',
    'Ice': '🧊',
    'Flame': '🔥',
    'Light': '💡',
    'Sand': '🏜️',
    'Smoke': '💨',
    'Bomb': '💣',
    'Spike': '🗡️',
    'Chop': '✂️',
    'Love': '💘',
    'Revive': '💀',
    'Rubber': '🎈',
    'Barrier': '🚧',
    'Quake': '🌎',
    'Human': '🧍',
    'Portal': '🚪',
    'Gravity': '🪐',
    'Control': '🎮',
    'String': '🧵',
    'Rumble': '⚡',
    'Falcon': '🦅',
    'Paw': '🐾',
    'Sound': '🎧',
    'Pain': '😖',
    'Atomic': '☢️',
    'Jet': '✈️',
    'Diamond': '💎'
  }

  const getEmoji = name => {
    const key = Object.keys(emojiMap).find(k => name.toLowerCase().includes(k.toLowerCase()))
    return emojiMap[key] || '🍥'
  }

  app.get('/search/bloxfruit', async (req, res) => {
    const q = (req.query.q || '').toLowerCase()
    if (!q) return res.json({ status: false, error: 'Missing query "q"' })

    try {
      const { data } = await axios.get('https://fruityblox.com/stock')
      const $ = cheerio.load(data)
      const result = []

      $('.p-4.border').each((_, el) => {
        const name = $(el).find('h3.font-medium').text().trim()
        if (!name.toLowerCase().includes(q)) return

        const stock = $(el).find('span.text-xs').text().trim()
        const price = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('$')).first().text().trim()
        const rValue = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('R')).first().text().trim()

        result.push(`${getEmoji(name)} ${name} - ${price} / ${rValue}`)
      })

      res.json({
        status: true,
        query: q,
        total: result.length,
        result
      })
    } catch {
      res.status(500).json({ status: false, error: 'Failed to fetch stock data' })
    }
  })
}
