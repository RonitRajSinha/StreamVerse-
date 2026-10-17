
import './style.css'

const movies = [
  { id: 157336, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 693134, title: 'Dune: Part Two', year: 2024, genre: 'Adventure', image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
  { id: 155, title: 'The Dark Knight', year: 2008, genre: 'Action', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 27205, title: 'Inception', year: 2010, genre: 'Sci-Fi', image: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { id: 569094, title: 'Spider-Man: Across the Spider-Verse', year: 2023, genre: 'Animation', image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
  { id: 361743, title: 'Top Gun: Maverick', year: 2022, genre: 'Action', image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
  { id: 414906, title: 'The Batman', year: 2022, genre: 'Crime', image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg' },
  { id: 76600, title: 'Avatar: The Way of Water', year: 2022, genre: 'Adventure', image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' }
]

const services = ['All', 'Netflix', 'Prime Video', 'JioHotstar']

let activeService = 'All'
let searchText = ''
let searchTimer
let searchResults = null
let isSearching = false
let searchError = ''

const providerCache = new Map()
const providerLoading = new Set()

let watchlist = []

try {
  const saved = JSON.parse(
    localStorage.getItem('streamverse-watchlist') || '[]'
  )
  if (Array.isArray(saved)) watchlist = saved
} catch {
  watchlist = []
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character])
}

function getPoster(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

function normalizeProvider(name) {
  if (name === 'Netflix') return 'Netflix'
  if (name.includes('Prime Video')) return 'Prime Video'
  if (name === 'Amazon Video') return 'Prime Video'
  if (name === 'JioHotstar' || name === 'Disney Plus Hotstar') {
    return 'JioHotstar'
  }
  return name
}

function getProviderClass(service) {
  if (service.includes('Netflix')) return 'tag-netflix'
  if (service.includes('Prime Video')) return 'tag-prime'
  if (service.includes('JioHotstar')) return 'tag-hotstar'
  return ''
}

document.querySelector('#app').innerHTML = `
  <header class="navbar">
    <a class="logo" href="#home">STREAM<span>VERSE</span><i>.</i></a>

    <nav class="nav-links">
      <a class="active" href="#home">Home</a>
      <a href="#discover">Discover</a>
      <a href="#services">Platforms</a>
      <a href="#watchlist">My List</a>
    </nav>

    <div class="nav-actions">
      <label class="search-box">
        <span>⌕</span>
        <input id="search" type="search" placeholder="Find a movie..." />
      </label>
      <div class="profile">S</div>
    </div>
  </header>

  <main>
    <section class="hero" id="home">
      <div class="hero-content">
        <div class="eyebrow">
          <span class="live-dot"></span>
          YOUR NEXT OBSESSION STARTS HERE
        </div>

        <h1>One universe.<br/><span>Endless stories.</span></h1>

        <p>
          Stop scrolling through apps. Discover your next favourite movie,
          explore streaming platforms, and keep everything you love in one place.
        </p>

        <div class="hero-buttons">
          <a href="#discover" class="btn btn-primary">
            Explore movies <span>↗</span>
          </a>
          <a href="#services" class="btn btn-secondary">
            Explore platforms
          </a>
        </div>

        <div class="hero-note">
          <span>✦</span> MADE FOR THE LOVE OF CINEMA
        </div>
      </div>

      <div class="hero-bottom">
        <span>YOUR PERSONAL ENTERTAINMENT UNIVERSE</span>
        <span>01 — DISCOVER EVERYTHING</span>
      </div>
    </section>

    <section class="services-section" id="services">
      <div class="section-heading">
        <div>
          <span class="section-kicker">YOUR STREAMING WORLD</span>
          <h2>All your worlds, <span>one place.</span></h2>
        </div>
        <p>Pick a platform to explore the collection.</p>
      </div>

      <div class="service-grid">
        <button class="service-card netflix" data-service="Netflix">
          <span class="service-mark">N</span>
          <span><strong>Netflix</strong><small>Movies & series</small></span>
          <span class="service-arrow">↗</span>
        </button>

        <button class="service-card prime" data-service="Prime Video">
          <span class="service-mark">prime</span>
          <span><strong>Prime Video</strong><small>Movies & originals</small></span>
          <span class="service-arrow">↗</span>
        </button>

        <button class="service-card hotstar" data-service="JioHotstar">
          <span class="service-mark">✦</span>
          <span><strong>JioHotstar</strong><small>Entertainment & more</small></span>
          <span class="service-arrow">↗</span>
        </button>
      </div>
    </section>

    <section class="discover-section" id="discover">
      <div class="section-heading">
        <div>
          <span class="section-kicker">HANDPICKED FOR YOUR NEXT MOVIE NIGHT</span>
          <h2>Discover <span>something great.</span></h2>
        </div>
        <span class="movie-count" id="movie-count"></span>
      </div>

      <div class="filter-row" id="filters">
        ${services.map(service => `
          <button
            class="filter-chip ${service === 'All' ? 'selected' : ''}"
            data-filter="${service}"
          >${service}</button>
        `).join('')}
      </div>

      <div id="search-status" role="status" aria-live="polite"></div>
      <div class="movie-grid" id="movie-grid"></div>
    </section>

    <section class="watchlist-section" id="watchlist">
      <div class="section-heading">
        <div>
          <span class="section-kicker">SAVED FOR LATER</span>
          <h2>Your personal <span>watchlist.</span></h2>
        </div>
      </div>

      <div class="movie-grid" id="watchlist-grid"></div>
    </section>

    <footer>
      <a class="logo" href="#home">STREAM<span>VERSE</span><i>.</i></a>
      <p>Your cinema discovery space. Built for movie lovers.</p>
      <span>DEMO PROJECT · 2026</span>
    </footer>
  </main>
`

function getCurrentMovies() {
  return searchResults !== null ? searchResults : movies
}

async function getMovieProviders(movieId) {
  try {
    const response = await fetch(`/api/movies/${movieId}/providers`)

    if (!response.ok) {
      throw new Error(`Provider lookup failed (${response.status})`)
    }

    const data = await response.json()
    const providers = data.providers

    if (!providers) return []

    return [...new Set(
      (providers.flatrate || []).map(provider =>
        normalizeProvider(provider.provider_name)
      )
    )]
  } catch (error) {
    console.error(`Provider lookup failed for movie ${movieId}:`, error)
    return null
  }
}

function ensureProviders(movieList) {
  for (const movie of movieList) {
    if (!movie.id || providerCache.has(movie.id) || providerLoading.has(movie.id)) {
      continue
    }

    providerLoading.add(movie.id)

    getMovieProviders(movie.id).then(providers => {
      providerLoading.delete(movie.id)
      providerCache.set(movie.id, providers)
      renderMovies()
    })
  }
}

function getMovieServices(movie) {
  if (!movie.id) return []
  return providerCache.get(movie.id) || []
}

function renderMovieCard(movie) {
  const title = escapeHTML(movie.title)
  const genre = escapeHTML(movie.genre || 'Movie')
  const year = escapeHTML(movie.year || 'N/A')
  const image = movie.image
  const saved = watchlist.includes(movie.title)
  const servicesForMovie = getMovieServices(movie)
  const checking = movie.id &&
    !providerCache.has(movie.id)
  const failed = movie.id &&
    providerCache.get(movie.id) === null

  let serviceText

  if (checking) {
    serviceText = 'Checking availability…'
  } else if (failed) {
    serviceText = 'Try again later'
  } else if (servicesForMovie.length) {
    serviceText = servicesForMovie.join(' · ')
  } else if (providerCache.has(movie.id)) {
    serviceText = 'No subscription listing found'
  } else {
    serviceText = 'Availability not checked'
  }

  const safeService = escapeHTML(serviceText)
  const providerClass = getProviderClass(serviceText)

  const imageMarkup = image
    ? `<img src="${escapeHTML(image)}" alt="${title} poster"
         loading="lazy" onerror="this.style.opacity='.15'" />`
    : `<div class="poster-placeholder">No poster available</div>`

  const watchLink = movie.id
    ? `https://www.themoviedb.org/movie/${movie.id}/watch?locale=IN`
    : 'https://www.themoviedb.org/'

  return `
    <article class="movie-card">
      <div class="poster-wrap">
        ${imageMarkup}

        <button
          class="save-btn ${saved ? 'saved' : ''}"
          data-save="${escapeHTML(movie.title)}"
          aria-label="${saved ? 'Remove from' : 'Add to'} watchlist"
        >${saved ? '♥' : '＋'}</button>

        <span class="poster-year">${year}</span>
      </div>

      <div class="movie-info">
        <div>
          <h3>${title}</h3>
          <p>${genre}</p>
        </div>
        <span class="provider-tag ${providerClass}">${safeService}</span>
      </div>

      <a href="${watchLink}" target="_blank" rel="noopener noreferrer">
        Check streaming options ↗
      </a>
    </article>
  `
}

function renderMovies() {
  const currentMovies = getCurrentMovies()
  ensureProviders(currentMovies)

  const filtered = currentMovies.filter(movie => {
    const matchesService =
      activeService === 'All' ||
      getMovieServices(movie).includes(activeService)

    const text = searchText.toLowerCase()

    const matchesSearch =
      movie.title.toLowerCase().includes(text) ||
      (movie.genre || '').toLowerCase().includes(text)

    return matchesService && matchesSearch
  })

  document.querySelector('#movie-count').textContent =
    `${filtered.length} TITLES`

  const status = document.querySelector('#search-status')

  if (isSearching) {
    status.textContent = 'Searching TMDB for movies...'
  } else if (searchError) {
    status.textContent = searchError
  } else if (searchResults !== null) {
    status.textContent =
      'Search results from TMDB. Availability is being checked for India.'
  } else {
    status.textContent = ''
  }

  document.querySelector('#movie-grid').innerHTML = filtered.length
    ? filtered.map(renderMovieCard).join('')
    : `<p class="empty-state">${
        activeService !== 'All'
          ? `No matching ${escapeHTML(activeService)} titles found in the current collection.`
          : searchResults !== null
            ? 'No movies found. Try another title.'
            : 'No titles found. Try another search or platform.'
      }</p>`

  renderWatchlist()
}

function renderWatchlist() {
  const allKnownMovies = [...movies, ...(searchResults || [])]
  const uniqueMovies = new Map()

  allKnownMovies.forEach(movie => {
    if (watchlist.includes(movie.title)) {
      uniqueMovies.set(movie.title, movie)
    }
  })

  const savedMovies = [...uniqueMovies.values()]
  const container = document.querySelector('#watchlist-grid')

  ensureProviders(savedMovies)

  container.innerHTML = savedMovies.length
    ? savedMovies.map(renderMovieCard).join('')
    : `<p class="empty-state">
        Your watchlist is waiting for its first movie.
        Tap ＋ on any poster to save it.
      </p>`
}

async function searchRealMovies(query) {
  isSearching = true
  searchError = ''
  renderMovies()

  try {
    const response = await fetch(
      `/api/movies/search?q=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error(`Movie search failed (${response.status})`)
    }

    const data = await response.json()

    if (query !== searchText.trim()) return

    searchResults = (data.results || [])
      .filter(movie => movie.title)
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date
          ? movie.release_date.slice(0, 4)
          : 'N/A',
        genre: movie.original_language
          ? `Language: ${movie.original_language.toUpperCase()}`
          : 'Movie',
        image: getPoster(movie.poster_path),
        overview: movie.overview || ''
      }))

  } catch (error) {
    console.error('Could not search movies:', error)

    if (query === searchText.trim()) {
      searchError =
        'Could not load movie results. Check that your API server is running.'
      searchResults = []
    }
  } finally {
    if (query === searchText.trim()) {
      isSearching = false
      renderMovies()
    }
  }
}

function selectService(service) {
  activeService = service
  searchText = ''
  searchResults = null
  searchError = ''
  isSearching = false

  clearTimeout(searchTimer)
  document.querySelector('#search').value = ''

  document.querySelectorAll('[data-filter]').forEach(chip => {
    chip.classList.toggle('selected', chip.dataset.filter === service)
  })

  renderMovies()
}

document.querySelector('#search').addEventListener('input', event => {
  searchText = event.target.value
  clearTimeout(searchTimer)

  const query = searchText.trim()

  if (query.length >= 2) {
    activeService = 'All'
    searchResults = null

    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.classList.toggle('selected', chip.dataset.filter === 'All')
    })

    searchTimer = setTimeout(() => searchRealMovies(query), 400)
  } else {
    searchResults = null
    isSearching = false
    searchError = ''
  }

  renderMovies()
})

document.querySelector('#filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]')
  if (button) selectService(button.dataset.filter)
})

document.querySelector('.service-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-service]')
  if (!button) return

  selectService(button.dataset.service)
  document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' })
})

document.querySelector('#app').addEventListener('click', event => {
  const button = event.target.closest('[data-save]')
  if (!button) return

  const title = button.dataset.save

  watchlist = watchlist.includes(title)
    ? watchlist.filter(item => item !== title)
    : [...watchlist, title]

  localStorage.setItem(
    'streamverse-watchlist',
    JSON.stringify(watchlist)
  )

  renderMovies()
})

renderMovies()
