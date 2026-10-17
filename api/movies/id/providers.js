
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN
  const id = req.query.id

  if (!token) {
    return res.status(500).json({ error: 'TMDB token is not configured' })
  }

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid movie ID' })
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json'
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB provider lookup failed'
      })
    }

    return res.status(200).json({
      id: Number(id),
      country: 'IN',
      providers: data.results?.IN || null
    })
  } catch (error) {
    console.error('TMDB provider error:', error.message)
    return res.status(500).json({
      error: 'Streaming availability lookup failed'
    })
  }
}
