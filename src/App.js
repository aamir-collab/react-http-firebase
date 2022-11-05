import React, { useState, useEffect } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchMovies();
  }, []);
  function fetchMovies() {
    setIsLoading(true);
    setError(null);
    fetch('https://react-http-ac6d2-default-rtdb.firebaseio.com/movies.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const loadedMovies = [];
        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          });
        }
        setMovies(loadedMovies);
      })
      .catch((error) => {
        setError(error.message);
      });
    setIsLoading(false);
  }
  function addMovieHandler(movie) {
    fetch('https://react-http-ac6d2-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      console.log(response.json());
    });
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>Found no movies..</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading..</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
