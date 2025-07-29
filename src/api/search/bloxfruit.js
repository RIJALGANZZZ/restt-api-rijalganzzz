const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment-timezone')

module.exports = function(app) {
  const emojiMap = {
    'Phoenix': '🕊️','Magma': '🌋','Dark': '🌘','Spring': '🌀','Blade': '🗡️',
    'Dragon': '🐉','Dough': '🍩','Leopard': '🐆','Spirit': '👻','Venom': '☠️',
    'Shadow': '🌑','Blizzard': '🌨️','Buddha': '🧘','Ice': '🧊','Flame': '🔥',
    'Light': '💡','Sand': '🏜️','Smoke': '💨','Bomb': '💣','Spike': '🗡️',
    'Chop': '✂️','Love': '💘','Revive': '💀','Rubber': '🎈','Barrier': '🚧',
    'Quake': '🌎','Human': '🧍','Portal': '🚪','Gravity': '🪐','Control': '🎮',
    'String': '🧵','Rumble': '⚡','Falcon': '🦅','Paw': '🐾','Sound': '🎧',
    'Pain': '😖','Atomic': '☢️','Jet': '✈️','Diamond': '💎'
  }

  const getEmoji = name => {
    const key = Object.keys(emojiMap).find(k => name.toLowerCase().includes(k.toLowerCase()))
    return emojiMap[key] || '🍥'
  }

  app.get('/search/bloxfruit', async (req, res) => {
    try {
      const { data } = await axios.get('https://fruityblox.com/stock')
      const $ = cheerio.load(data)
      const result = []

      $('.p-4.border').each((_, el) => {
        const name = $(el).find('h3.font-medium').text().trim()
        const stock = $(el).find('span.text-xs').text().trim()
        const price = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('$')).first().text().trim()
        const rValue = $(el).find('span.text-sm').filter((_, e) => $(e).text().includes('R')).first().text().trim()

        result.push({
          name,
          emoji: getEmoji(name),
          stock,
          price,
          robux: rValue
        })
      })

      res.json({
        status: true,
        creator: 'Rijalganzz',
        updated: moment().tz('Asia/Jakarta').format('HH:mm:ss'),
        total: result.length,
        result
      })
    } catch {
      res.status(500).json({ status: false, error: 'Failed to fetch stock data' })
    }
  })
}
