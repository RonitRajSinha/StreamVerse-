# 🎬 StreamVerse

### One universe. Endless stories.

**StreamVerse** is a movie discovery website built for people who love cinema. Search for movies, explore their posters and details, check streaming availability in India, and save titles to your personal watchlist—all in one place.

🔗 **Live Demo:** https://stream-verse-gules.vercel.app/

---

## ✨ Features

- 🔎 **Movie Search** — Search for real movies using The Movie Database (TMDB) API.
- 🖼️ **Movie Posters** — Browse movies with their posters and release years.
- 📺 **Streaming Availability** — Check available streaming providers in India using TMDB watch-provider data.
- 🎯 **Platform Filters** — Explore Netflix, Prime Video, and JioHotstar categories.
- ❤️ **Personal Watchlist** — Save your favourite movies and keep your list in local storage.
- 🎨 **Cinematic UI** — Enjoy a dark, cinematic interface with animations, hover effects, and responsive movie cards.
- 🔗 **Watch Options** — Open TMDB's official movie watch page to explore available viewing options.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Vite
- Node.js
- Express.js
- TMDB API
- Git and GitHub
- Vercel

## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- A TMDB API read access token

### 1. Clone the repository

```bash
git clone https://github.com/RonitRajSinha/StreamVerse-.git
cd StreamVerse
```

If the cloned directory has a different name, enter that directory instead.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```

Never commit `.env.local` or expose your API token publicly.

### 4. Start the backend

Open a terminal and run:

```bash
npm run server
```

The API server should run at `http://localhost:3000`.

### 5. Start the frontend

Open a second terminal in the project directory and run:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

**Note:** The frontend's `/api` requests use a Vite development proxy to reach the local backend. The deployed Vercel frontend requires a separately deployed backend or a serverless API implementation for live movie search and streaming availability to work in production.

## 🔐 API and Data

StreamVerse uses [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie search, posters, and streaming-provider information.

Streaming availability may vary by country and change over time. A provider listing does not guarantee that every title is included in a subscription; rental and purchase options may also be listed.

This project is an independent movie discovery tool and is not affiliated with Netflix, Amazon Prime Video, JioHotstar, or TMDB.

## 🗺️ Roadmap

- [x] Cinematic movie discovery interface
- [x] TMDB movie search and posters
- [x] Search, platform filters, and personal watchlist
- [x] Backend API for streaming-provider lookups
- [ ] Deploy the backend for production use
- [ ] Improve provider matching and loading states
- [ ] Add movie detail pages and richer movie information
- [ ] Improve accessibility and mobile experience

## 👨‍💻 Author

**Ronit Raj Sinha**

Computer Science and Data Analytics student, learning by building practical projects.

- GitHub: [@RonitRajSinha](https://github.com/RonitRajSinha)

---

*Built for those who love movies.* 🍿

*Movie data and images are provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.*
