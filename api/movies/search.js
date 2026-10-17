
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN
  const query = req.query.q

  if (!token) {
    return res.status(500).json({ error: 'TMDB token is not configured' })
  }

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Search query is required' })
  }

  try {
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', query.trim())
    url.searchParams.set('include_adult', 'false')
    url.searchParams.set('region', 'IN')

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB movie search failed'
      })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('TMDB search error:', error.message)
    return res.status(500).json({ error: 'Movie search failed' })
  }
}
