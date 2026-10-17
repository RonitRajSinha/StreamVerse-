
import './style.css'

const movies = [
  {
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    service: 'Prime Video',
    image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
  },
  {
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Adventure',
    service: 'JioHotstar',
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    service: 'Netflix',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
  },
  {
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    service: 'Netflix',
    image: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genre: 'Animation',
    service: 'Prime Video',
    image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
  },
  {
    title: 'Top Gun: Maverick',
    year: 2022,
    genre: 'Action',
    service: 'JioHotstar',
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'
  },
  {
    title: 'The Batman',
    year: 2022,
    genre: 'Crime',
    service: 'JioHotstar',
    image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'
  },
  {
    title: 'Avatar: The Way of Water',
    year: 2022,
    genre: 'Adventure',
    service: 'JioHotstar',
    image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
  }
]

const services = ['All', 'Netflix', 'Prime Video', 'JioHotstar']
let activeService = 'All'
let searchText = ''
let watchlist = JSON.parse(localStorage.getItem('streamverse-watchlist') || '[]')

document.querySelector('#app').innerHTML = `
  <header class="navbar">
    <a class="logo" href="#">STREAM<span>VERSE</span><i>.</i></a>

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
        <div class="eyebrow"><span class="live-dot"></span> YOUR NEXT OBSESSION STARTS HERE</div>
        <h1>One universe.<br/><span>Endless stories.</span></h1>
        <p>Stop scrolling through apps. Discover your next favourite movie, explore streaming platforms, and keep everything you love in one place.</p>
        <div class="hero-buttons">
          <a href="#discover" class="btn btn-primary">Explore movies <span>↗</span></a>
          <a href="#services" class="btn btn-secondary">Explore platforms</a>
        </div>
        <div class="hero-note"><span>✦</span> MADE FOR THE LOVE OF CINEMA</div>
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
          <button class="filter-chip ${service === 'All' ? 'selected' : ''}" data-filter="${service}">
            ${service}
          </button>
        `).join('')}
      </div>

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

function renderMovies() {
  const filtered = movies.filter(movie => {
    const matchesService = activeService === 'All' || movie.service === activeService
    const matchesSearch = movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchText.toLowerCase())
    return matchesService && matchesSearch
  })

  document.querySelector('#movie-count').textContent = `${filtered.length} TITLES`

  document.querySelector('#movie-grid').innerHTML = filtered.length
    ? filtered.map(movie => `
      <article class="movie-card">
        <div class="poster-wrap">
          <img src="${movie.image}" alt="${movie.title} poster" loading="lazy"
               onerror="this.style.opacity='.15'" />
          <button class="save-btn ${watchlist.includes(movie.title) ? 'saved' : ''}"
                  data-save="${movie.title}" aria-label="Toggle watchlist">
            ${watchlist.includes(movie.title) ? '♥' : '＋'}
          </button>
          <span class="poster-year">${movie.year}</span>
        </div>
        <div class="movie-info">
          <div><h3>${movie.title}</h3><p>${movie.genre}</p></div>
          <span class="provider-tag ${movie.service === 'Netflix' ? 'tag-netflix' : movie.service === 'Prime Video' ? 'tag-prime' : 'tag-hotstar'}">${movie.service}</span>
        </div>
      </article>
    `).join('')
    : '<p class="empty-state">No titles found. Try another search or platform.</p>'

  renderWatchlist()
}

function renderWatchlist() {
  const savedMovies = movies.filter(movie => watchlist.includes(movie.title))
  const container = document.querySelector('#watchlist-grid')

  container.innerHTML = savedMovies.length
    ? savedMovies.map(movie => `
      <article class="movie-card">
        <div class="poster-wrap">
          <img src="${movie.image}" alt="${movie.title} poster" loading="lazy" />
          <button class="save-btn saved" data-save="${movie.title}" aria-label="Remove from watchlist">♥</button>
          <span class="poster-year">${movie.year}</span>
        </div>
        <div class="movie-info">
          <div><h3>${movie.title}</h3><p>${movie.genre}</p></div>
          <span class="provider-tag">${movie.service}</span>
        </div>
      </article>
    `).join('')
    : '<p class="empty-state">Your watchlist is waiting for its first movie. Tap ＋ on any poster to save it.</p>'
}

document.querySelector('#search').addEventListener('input', event => {
  searchText = event.target.value
  renderMovies()
})

document.querySelector('#filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]')
  if (!button) return

  activeService = button.dataset.filter

  document.querySelectorAll('[data-filter]').forEach(chip => {
    chip.classList.toggle('selected', chip === button)
  })

  renderMovies()
})

document.querySelector('.service-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-service]')
  if (!button) return

  activeService = button.dataset.service

  document.querySelectorAll('[data-filter]').forEach(chip => {
    chip.classList.toggle('selected', chip.dataset.filter === activeService)
  })

  renderMovies()
  document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' })
})

document.querySelector('#app').addEventListener('click', event => {
  const button = event.target.closest('[data-save]')
  if (!button) return

  const title = button.dataset.save

  watchlist = watchlist.includes(title)
    ? watchlist.filter(item => item !== title)
    : [...watchlist, title]

  localStorage.setItem('streamverse-watchlist', JSON.stringify(watchlist))
  renderMovies()
})

renderMovies()
