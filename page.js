"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

// API keys
const TMDB_API_KEY = 'e86759adae1b269a4c0a6a11eb52a092'; // Replace with your TMDB API key
const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/';

// Movie Card Component
const MovieCard = ({ movie }) => (
  <div style={styles.card}>
    <Image
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      width={200}
      height={300}
    />
    <h3>{movie.title}</h3>
    <p>{movie.release_date.split('-')[0]}</p>
    <Link href={`/movie/${movie.id}`}>More Details</Link>
  </div>
);

// Book Card Component
const BookCard = ({ book }) => (
  <div style={styles.card}>
    <Image
      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
      alt={book.title}
      width={200}
      height={300}
    />
    <h3>{book.title}</h3>
    <p>{book.author_name?.[0]}</p>
    <Link href={`/book/${book.key}`}>More Details</Link>
  </div>
);

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('favorites')) || [] : []
  );
  const [loading, setLoading] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        setMovies(res.data.results);
        setFilteredMovies(res.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${OPEN_LIBRARY_API_URL}search.json?q=harry+potter`
        );
        setBooks(res.data.docs);
        setFilteredBooks(res.data.docs);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredBooks(
      books.filter((book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, movies, books]);

  const handleAddToFavorites = (item) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div style={styles.container}>
      <h1>Movie & Book Recommendation App</h1>
      <div style={styles.search}>
        <input
          type="text"
          placeholder="Search Movies or Books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading && <p>Loading...</p>}

      <h2>Movies</h2>
      <div style={styles.grid}>
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <h2>Books</h2>
      <div style={styles.grid}>
        {filteredBooks.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </div>
  );
}

// Styles for the page
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  search: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  card: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    justifyItems: 'center',
    marginTop: '20px',
  },
};
