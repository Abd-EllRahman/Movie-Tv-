import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Tv.css';

export default function Series() {
  const [series, setSeries] = useState([]);
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function getData() {
    try {
      // Make all three API calls simultaneously
      const [trending, onAir, topRated] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`),
        axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`),
        axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`)
      ]);

      // Add a source property to each API result
      const trendingWithSource = trending.data.results.map(item => ({ ...item, source: 'Trending' }));
      const onAirWithSource = onAir.data.results.map(item => ({ ...item, source: 'On Air' }));
      const topRatedWithSource = topRated.data.results.map(item => ({ ...item, source: 'Top Rated' }));

      // Combine the results of the three API calls
      const combinedSeries = [
        ...trendingWithSource, 
        ...onAirWithSource, 
        ...topRatedWithSource
      ];

      setSeries(combinedSeries);
    } catch (error) {
      console.error("Error fetching TV series data", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {series
          .filter(series => !series.genre_ids.includes(16))
          .map((ele, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card h-100 w-100">
                <div className="image-container">
                  <Link to={`/detailstv/${ele.id}`} onClick={handleScrollToTop}>
                    <img
                      src={ele.poster_path
                        ? `https://image.tmdb.org/t/p/w500${ele.poster_path}`
                        : 'https://via.placeholder.com/500x750.png?text=Image+Not+Available'}
                      className="card-img-top"
                      style={{ border: '2px inset #D98236' }}
                      alt={ele.title || 'Image not available'}
                    />
                    <div className="overlay">
                      <span className="movie-title">{ele.name}</span>
                    </div>
                    {/* Vote */}
                    <div className="vote">
                      {ele.vote_average ? ele.vote_average.toFixed(1) : '--'}
                    </div>
                  </Link>
                  {/* API Source Tag */}
                  <div className="source-tag" >
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
