import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrailer } from '../Home/Home'; 
import './DetailesMovie.css'
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function ItemDetails() {
  let { id } = useParams();
  const [itemDetails, setItemDetails] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);
  const [noTrailerMessage, setNoTrailerMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [cast, setCast] = useState([]); 
  const [movieSimilar, setMovieSimilar] = useState([]); 

  const handleScrollToTop = () => {
    setNoTrailerMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch detailed movie information by ID
  async function getItemDetails(id) {
    setLoading(true); // Set loading to true when fetching data
    try {
      const movieDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`
      );
      setItemDetails(movieDetails.data);
      await getMovieCast(id); // Fetch the cast after getting movie details
      await getMovieSimilar(id); // Fetch similar movies
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details', error);
      setError('Error fetching movie details');
      setLoading(false); // Stop loading on error
    }
  };

  // Fetch similarities 
  async function getMovieSimilar(id) {
    try {
      const movieDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`
      );
      setMovieSimilar(movieDetails.data.results); // Update this line to use 'results'
    } catch (error) {
      console.error('Error fetching similar movies', error);
    }
  }

  // Fetch cast details for the movie
  async function getMovieCast(id) {
    try {
      const castDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=44ee5523e457e74020effc2bddc4592e&language=en-US&include_adult=false`
      );
      setCast(castDetails.data.cast); // Set the cast state with fetched data
    } catch (error) {
      console.error('Error fetching movie cast', error);
    }
  }

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

  useEffect(() => {
    getItemDetails(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <>
      <div className="det">
        <div className="col-md-3 poster-container">
          {itemDetails.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500/${itemDetails.poster_path}`}
              className="poster-image"
              alt={itemDetails.title || 'Movie Poster'}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              src="https://via.placeholder.com/500x750.png?text=Image+Not+Available"
              className="poster-image"
              alt="Image Not Available"
            />
          )}
        </div>
        <div className="col-md-9 details-container">
          <h2 className="display-4 text-shadow text-light">{itemDetails.title}</h2>
          <p className='text-light ms-1'>{itemDetails.tagline}</p>
          <ul className="list-unstyled d-flex flex-wrap">
          <li className="genre-badge text-light" style={{ backgroundColor: '#D98236' }}>
                {'Movie'}

            </li>
            {itemDetails.genres?.map((genre) => (
              <li key={genre.id} className="genre-badge text-light" style={{ backgroundColor: '#D98236' }}>
                {genre.name}
              </li>
            ))}
          </ul>
          
          {/* Display actors' names */}
          <h4 className="heading py-2">Cast:</h4>
          <ul className="cast-list">
            {cast.length > 0 ? (
              cast.slice(0, 5).map(actor => (
                <li key={actor.id} className="cast-item text-light">{actor.name}</li>
              ))
            ) : (
              <p>No cast information available</p>
            )}
          </ul>

          <div className="data">
            <h4 className="heading py-2">Language:</h4>
            <p className="ms-3 pt-1 text-light"> {itemDetails.original_language || "N/A"}</p>
          </div>
          <div className="data">
            <h4 className="heading py-2">Vote:</h4>
            <p className="ms-3 pt-1 text-light"> {itemDetails?.vote_average?.toFixed(1)}</p>
          </div>
          <div className="data">
            <h4 className="heading py-2">Vote Count:</h4>
            <p className="ms-3 pt-1 text-light"> {itemDetails?.vote_count}</p>
          </div>
          <div className="data">
            <h4 className="heading py-2">Popularity:</h4>
            <p className="ms-3 pt-1 text-light"> {itemDetails?.popularity?.toFixed(1)}</p>
          </div>
          <div className="data">
            <h4 className="heading py-2">Release Date:</h4>
            <p className="ms-3 pt-1 text-light"> {itemDetails?.release_date}</p>
          </div>
          <p className="text-light">{itemDetails.overview}</p>
          
          <button
            className="custom-button"
            onClick={() => fetchTrailer(itemDetails.id, 'movie', setTrailerKey, setNoTrailerMessage)} // Pass the required parameters
            aria-label="Watch Trailer"
          >
            Watch Trailer
          </button>

          {trailerKey && (
            <div className="trailer-modal">
              <button className="trailer-close-btn" onClick={() => setTrailerKey(null)} aria-label="Close trailer">&times;</button>
              <iframe
                width="100%"
                height="500px"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {noTrailerMessage && <p>{noTrailerMessage}</p>}
        </div>
      </div>

      {movieSimilar.length > 0 && ( // Check if there are similar movies
        <div className="upcoming-section py-5 text-light">
          <div className="container">
            <h2 className="display-4 text-shadow">You might also like</h2>
            <Slider {...sliderSettings}>
              {movieSimilar.map((movie) => (
                <div key={movie.id} className="px-2">
                  <div className="card bg-secondary text-light">
                    <Link to={`/detailsmovie/${movie.id}`} onClick={handleScrollToTop}>
                      <img
                        src={movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750.png?text=Image+Not+Available'}
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
      )}
    </>
  );
}
