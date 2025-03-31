import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  if (favorites.length === 0) {
    return <p>No favorites found!</p>;
  }

  return (
    <div>
      <h1>Your Favorites</h1>
      <div>
        {favorites.map((item, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <h3>{item.title || 'Untitled'}</h3>
            <button
              onClick={() => {
                if (item.link) {
                  router.push(item.link);
                } else {
                  alert('No details available for this item.');
                }
              }}
            >
              Go to Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
