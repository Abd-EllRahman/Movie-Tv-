import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Banner.css'; 
import '../Navbar/Navbar.css';
import { Link } from 'react-router-dom';

  // Fetch trailer for the current item
export async function fetchTrailer(id, mediaType, setTrailerKey, setNoTrailerMessage) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=44ee5523e457e74020effc2bddc4592e`
    );
    const trailers = response.data.results.filter(video => video.site === 'YouTube' && video.type === 'Trailer');
    if (trailers.length > 0) {
      setTrailerKey(trailers[0].key);
      setNoTrailerMessage(''); // Clear any previous message
    } else {
      console.warn(`No trailer found for ${mediaType} with ID: ${id}`);
      setTrailerKey(null);
      setNoTrailerMessage('No Trailer Available.'); // Set no trailer message
    }
  } catch (error) {
    console.error('Error fetching trailer', error);
    setTrailerKey(null);
    setNoTrailerMessage('An error occurred while fetching the trailer.'); // Set error message
  }
}

export default function MoviesPage() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genres, setGenres] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [onAir, setOnAir] = useState([]);
  const [popularSeries, setPopularSeries] = useState([])
  const [noTrailerMessage, setNoTrailerMessage] = useState('');
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch all data concurrently
  async function fetchAllData() {
    try {
      const [
        movieGenresResponse,
        tvGenresResponse,
        popularMoviesResponse,
        popularSeriesResponse,
        upcomingMoviesResponse,
        topRatedMoviesResponse,
        topRatedSeriesResponse,
        onAirResponse,
      ] = await Promise.all([
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/genre/tv/list?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/trending/movie/day?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/trending/tv/day?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/tv/top_rated?api_key=44ee5523e457e74020effc2bddc4592e'),
        axios.get('https://api.themoviedb.org/3/tv/on_the_air?api_key=44ee5523e457e74020effc2bddc4592e'),
      ]);

      // Combine genres from movies and TV
      const combinedGenres = {
        ...movieGenresResponse.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {}),
        ...tvGenresResponse.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {}),
      };

      // Combine all movies and series into one array
      const combinedItems = [
        ...popularMoviesResponse.data.results.map(item => ({ ...item, media_type: 'movie' })),
        ...popularSeriesResponse.data.results.map(item => ({ ...item, media_type: 'tv' })),
        ...upcomingMoviesResponse.data.results.map(item => ({ ...item, media_type: 'movie' })),
        ...topRatedMoviesResponse.data.results.map(item => ({ ...item, media_type: 'movie' })),
        ...topRatedSeriesResponse.data.results.map(item => ({ ...item, media_type: 'tv' })),
        ...onAirResponse.data.results.map(item => ({ ...item, media_type: 'tv' })),
      ].sort(() => Math.random() - 0.5); // Shuffle the combined items

      // Set the data into state
      setGenres(combinedGenres);
      setPopularMovies(popularMoviesResponse.data.results);
      setItems(combinedItems);
      setUpcomingMovies(upcomingMoviesResponse.data.results);
      setTopRatedMovies(topRatedMoviesResponse.data.results);
      setPopularSeries(popularSeriesResponse.data.results)
      setTopRatedSeries(topRatedSeriesResponse.data.results);
      setOnAir(onAirResponse.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

 
  
  useEffect(() => {
    fetchAllData(); // Fetch all data on component mount
  }, []);

  // Navigate through items
  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];
  const genreNames = currentItem?.genre_ids?.map(id => genres[id]).join(', ') || '';

  // Slider settings for popular movies
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {currentItem && (
        <div
          className="banner d-flex align-items-end justify-content-start"
          style={{
            height: '100vh',
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${currentItem.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity for desired darkness
              zIndex: 1, // Ensure it is below the content
            }}
          ></div>

          <div className="banner-content text-light p-4" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="display-4 text-shadow">
              {currentItem.title || currentItem.name}
              <span className="fs-6 text-light ms-2 text-shadow">{currentItem.origin_country}</span>
            </h1>
            <p className="text-shadow">
              {currentItem.media_type} | {genreNames} | {(currentItem.rmoviease_date || currentItem.first_air_date)}
            </p>
            <p className="overview text-shadow">{currentItem.overview}</p>
            <p className="text-shadow">Language: {currentItem.original_language}</p>
            <p className="text-shadow">Rating: {currentItem.vote_average.toFixed(1)}</p>
            <div className="d-flex">
            <button
              className="custom-button"
              onClick={() => fetchTrailer(currentItem.id, currentItem.media_type, setTrailerKey, setNoTrailerMessage)}
              aria-label="Watch Trailer"
            >
              Watch Trailer
           </button>

            </div>
          </div>

          {/* Fixed Position Buttons */}
          <div className="carousel-arrows position-absolute top-50 start-0 end-0 d-flex justify-content-between" style={{ zIndex: 3 }}>
            <button className="custom-button" onClick={prevItem} aria-label="Previous Item" style={{ position: 'fixed', left: '20px', bottom: '10px', transform: 'translateY(-50%)' }}>&lt;</button>
            <button className="custom-button" onClick={nextItem} aria-label="Next Item" style={{ position: 'fixed', right: '20px', bottom: '10px', transform: 'translateY(-50%)' }}>&gt;</button>
          </div>

          {trailerKey && (
            <div className="trailer-modal">
              <button className="trailer-close-btn" onClick={() => setTrailerKey(null)} aria-label="Close trailer">&times;</button>
              <iframe
                width="100%"
                height="500px"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accmovierometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

{noTrailerMessage && (
  <div className="alert alert-warning d-flex justify-content-between align-items-center" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
    <span>{noTrailerMessage}</span>
    <button className="btn-close" onClick={() => setNoTrailerMessage('')} aria-label="Close message" style={{ marginLeft: '10px' }}></button>
  </div>
)}

        </div>
      )}

      {/* Popular Movies Slider */}
      <div className="popular-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">Trending Movies</h2>
          <Slider {...sliderSettings}>
            {popularMovies
            .filter(movie => !movie.genre_ids.includes(16)) // Exclude anime genre
            .slice(0, 10)
            .map((movie) => (
              <div key={movie.id} className="px-2">
                <div className="card bg-secondary text-light">
                <Link to={`/detailsmovie/${movie.id}`} onClick={handleScrollToTop}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={movie.title}
                  />
                  <div className="overlay">
                    <span className="movie-title">{movie.title}</span>
                  </div>
                </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Upcoming Movies Slider */}
      <div className="upcoming-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">Upcoming Movies</h2>
          <Slider {...sliderSettings}>
            {upcomingMovies
            .filter(movie => !movie.genre_ids.includes(16)) // Exclude anime genre
            .slice(0, 10)
            .map((movie) => (
              <div key={movie.id} className="px-2">
                <div className="card bg-secondary text-light">
                <Link to={`/detailsmovie/${movie.id}`} onClick={handleScrollToTop}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={movie.title}
                  />
                  <div className="overlay">
                    <span className="movie-title">{movie.title}</span>
                  </div>
                </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Top Rated Movies Slider */}
      <div className="top-rated-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">Top Rated Movies</h2>
          <Slider {...sliderSettings}>
            {topRatedMovies
            .filter(movie => !movie.genre_ids.includes(16)) // Exclude anime genre
            .slice(0, 10)
            .map((movie) => (
              <div key={movie.id} className="px-2">
                <div className="card bg-secondary text-light">
                <Link to={`/detailsmovie/${movie.id}`} onClick={handleScrollToTop}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={movie.title}
                  />
                  <div className="overlay">
                    <span className="movie-title">{movie.title}</span>
                  </div>
                </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* Popular Series Slider */}
      <div className="top-rated-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">Trending Series</h2>
          <Slider {...sliderSettings}>
            {popularSeries
            .filter(popularseries=> !popularseries.genre_ids.includes(16)) // Exclude anime genre
            .slice(0, 10)
            .map((popularseries) => (
              <div key={popularseries.id} className="px-2">
                <div className="card bg-secondary text-light">
                <Link to={`/detailstv/${popularseries.id}`} onClick={handleScrollToTop}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${popularseries.poster_path}`}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={popularseries.title}
                  />
                  <div className="overlay">
                    <span className="movie-title">{popularseries.name}</span>
                  </div>
                </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Top Rated TV Series Slider */}
      <div className="top-rated-series-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">Top Rated TV Series</h2>
          <Slider {...sliderSettings}>
            {topRatedSeries
              .filter(series => !series.genre_ids.includes(16)) // Exclude anime genre
              .slice(0,10)
              .map((series) => (
                <div key={series.id} className="px-2">
                  <div className="card bg-secondary text-light">
                  <Link to={`/detailstv/${series.id}`} onClick={handleScrollToTop}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
                      className="card-img-top"
                      style={{ border: '2px inset #D98236' }}
                      alt={series.name}
                    />
                    <div className="overlay">
                    <span className="movie-title">{series.name}</span>
                    </div>
                  </Link>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>

      {/* On Air TV Series Slider */}
      <div className="on-air-section py-5 text-light">
        <div className="container">
          <h2 className="display-4 text-shadow">On Air TV Series</h2>
          <Slider {...sliderSettings}>
            {onAir
            .filter(series => !series.genre_ids.includes(16)) // Exclude anime genre
            .slice(0, 10)
            .map((series) => (
              <div key={series.id} className="px-2">
                <div className="card bg-secondary text-light">
                <Link to={`/detailstv/${series.id}`} onClick={handleScrollToTop}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={series.name}
                  />
                    <div className="overlay">
                    <span className="movie-title">{series.name}</span>
                    </div>
                </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
