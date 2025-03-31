"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/';

export default function BookDetail() {
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null); // To handle any errors
  const { query } = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      if (!query.key) return; // Ensure there's a valid query key

      try {
        const res = await axios.get(
          `${OPEN_LIBRARY_API_URL}works/${query.key}.json`
        );
        setBook(res.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. Please try again later.');
      }
    };

    fetchBook();
  }, [query.key]);

  if (error) return <p>{error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.authors && book.authors[0] ? book.authors[0].name : 'Unknown author'}</p>
      <p>{book.description || 'No description available.'}</p>
    </div>
  );
}
