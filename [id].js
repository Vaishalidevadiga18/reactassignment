"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';  // <-- Missing import for Image

const TMDB_API_KEY = 'e86759adae1b269a4c0a6a11eb52a092'; // Ensure you store API key securely in environment variables

export default function MovieDetail() {
  const [movie, setMovie] = useState(null);
  const { query } = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${query.id}?api_key=${TMDB_API_KEY}`
        );
        setMovie(res.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    if (query.id) fetchMovie();
  }, [query.id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
      />
      <p>{movie.release_date}</p>
      <p>{movie.overview}</p>
    </div>
  );
}
