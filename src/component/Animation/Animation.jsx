import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import '../Movie/Movie.css';
import { Link } from 'react-router-dom';

export default function Movies() {
  const [movies, setMovies] = useState([]); 
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function getData() {
    try {
      setLoading(true);
      const [trendingMovies, upcomingMovies, topRatedMovies] = await Promise.all([
        axios.get('https://api.themoviedb.org/3/trending/movie/day?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'),
        axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'),
        axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false')
      ]);

      const combinedMovies = [
        ...trendingMovies.data.results,
        ...upcomingMovies.data.results,
        ...topRatedMovies.data.results,
      ];

      const uniqueMovies = Array.from(
        new Map(combinedMovies.map((movie) => [movie.id, movie])).values()
      );

      setMovies(uniqueMovies);
    } catch (error) {
      setError("Error fetching movies data.");
      console.error('Error fetching data:', error);
    }
    
    try {
      const [trending, onAir, topRated] = await Promise.all([
        axios.get('https://api.themoviedb.org/3/trending/tv/day?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'),
        axios.get('https://api.themoviedb.org/3/tv/on_the_air?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false'),
        axios.get('https://api.themoviedb.org/3/tv/top_rated?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false')
      ]);

      const combinedSeries = [
        ...trending.data.results, 
        ...onAir.data.results, 
        ...topRated.data.results
      ];

      setSeries(combinedSeries);
    } catch (error) {
      setError("Error fetching TV series data.");
      console.error("Error fetching TV series data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter movies and series for anime genre (ID: 16)
  const filteredAnime = [
    ...movies.filter(item => item.genre_ids && item.genre_ids.includes(16)),
    ...series.filter(item => item.genre_ids && item.genre_ids.includes(16))
  ];

  return (
    <div className="container">
      <div className="row">
        {filteredAnime.map((ele) => (
          <div className="col-md-3 mb-4" key={ele.id}>
            <div className="card h-100 w-100">
              <div className="image-container">
              <Link 
                     to={ele.media_type === 'tv' || ele.name ? `/detailstv/${ele.id}` : `/detailsmovie/${ele.id}`} 
                     onClick={handleScrollToTop}
                        >

                  <img
                    src={ele.poster_path
                      ? `https://image.tmdb.org/t/p/w500${ele.poster_path}`
                      : 'https://via.placeholder.com/500x750.png?text=Image+Not+Available'}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={ele.title || ele.name || 'Image not available'}
                  />
                  <div className="overlay">
                    <span className="movie-title">{ele.title || ele.name}</span>
                  </div>
                  <div className="vote">
                    {ele.vote_average ? ele.vote_average.toFixed(1) : '--'}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
