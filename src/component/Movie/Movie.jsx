import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './Movie.css';
import { Link } from 'react-router-dom';


export default function Movies() {
  const [movies, setMovies] = useState([]); 
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch data from all three APIs
  async function getData() {
    try {
      // Fetch data from each API
      const trendingMovies = await axios.get(
        'https://api.themoviedb.org/3/trending/movie/day?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'
      );
      const upcomingMovies = await axios.get(
        'https://api.themoviedb.org/3/movie/upcoming?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'
      );
      const topRatedMovies = await axios.get(
        'https://api.themoviedb.org/3/movie/top_rated?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'
      );

      // Add 'source' property to each movie from the respective API
      const trendingWithSource = trendingMovies.data.results.map(movie => ({ ...movie, source: 'Trending' }));
      const upcomingWithSource = upcomingMovies.data.results.map(movie => ({ ...movie, source: 'Upcoming' }));
      const topRatedWithSource = topRatedMovies.data.results.map(movie => ({ ...movie, source: 'Top Rated' }));

      // Combine the results from all three APIs
      const combinedMovies = [
        ...trendingWithSource,
        ...upcomingWithSource,
        ...topRatedWithSource,
      ];

      // Remove duplicates by filtering movies based on unique movie IDs
      const uniqueMovies = Array.from(
        new Map(combinedMovies.map((movie) => [movie.id, movie])).values()
      );

      // Update state with the unique list of movies
      setMovies(uniqueMovies);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {movies
          .filter(movie => !movie.genre_ids.includes(16))
          .map((ele, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card h-100 w-100">
                <div className="image-container">
                  <Link to={`/detailsmovie/${ele.id}`} onClick={handleScrollToTop}>
                    <img
                      src={ele.poster_path
                        ? `https://image.tmdb.org/t/p/w500${ele.poster_path}`
                        : 'https://via.placeholder.com/500x750.png?text=Image+Not+Available'}
                      className="card-img-top"
                      style={{ border: '2px inset #D98236' }}
                      alt={ele.title || 'Image not available'}
                    />
                    <div className="overlay">
                      <span className="movie-title">{ele.title}</span>
                    </div>
                    {/* Vote */}
                    <div className="vote">
                      {ele.vote_average ? ele.vote_average.toFixed(1) : '--'}
                    </div>
                  </Link>
                  {/* API Source Tag */}
                  <div className="source-tag">
                    {ele.source}
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
