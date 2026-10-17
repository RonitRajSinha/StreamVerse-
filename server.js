
import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "StreamVerse API is running" });
});

app.get("/api/movies/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({ error: "Please provide a movie search query." });
    }

    if (!TMDB_TOKEN) {
      return res.status(500).json({ error: "TMDB token is not configured." });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("TMDB returned status:", response.status);
      return res.status(502).json({ error: "Could not retrieve movies from TMDB." });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Movie search failed:", error.message);
    res.status(500).json({ error: "An unexpected server error occurred." });
  }
});


app.get("/api/movies/:id/providers", async (req, res) => {
  try {
    const movieId = String(req.params.id || "").trim();

    if (!/^\d+$/.test(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID." });
    }

    if (!TMDB_TOKEN) {
      return res.status(500).json({
        error: "TMDB token is not configured."
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      console.error("TMDB providers returned status:", response.status);
      return res.status(502).json({
        error: "Could not retrieve streaming providers."
      });
    }

    const data = await response.json();

    res.json({
      id: Number(movieId),
      country: "IN",
      providers: data.results?.IN || null
    });
  } catch (error) {
    
    console.error("Provider lookup failed:", error);

    res.status(500).json({
      error: "An unexpected server error occurred."
    });
  }
});


app.listen(PORT, () => {
  console.log(`StreamVerse API running at http://localhost:${PORT}`);
});
