import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick'; 
import './DetailsPerson.css'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 

export default function DetailsPerson() {
  const { id } = useParams(); 
  const [person, setPerson] = useState(null); 
  const [movies, setMovies] = useState([]); 
  const [shows, setShows] = useState([]); 
  const [songs, setSongs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [showFullBio, setShowFullBio] = useState(false); 

  async function getData() {
    try {
      const personResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=44ee5523e457e74020effc2bddc4592e&language=en-US&include_adult=false`);
      const personData = personResponse.data;
      setPerson(personData); 

      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`);
      setMovies(creditsResponse.data.cast); 

      const tvResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`);
      setShows(tvResponse.data.cast); 

      if (personData.known_for_department === 'Music') {
        const musicResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}/music_credits?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`);
        setSongs(musicResponse.data.cast); 
      }

      setLoading(false); 
    } catch (error) {
      console.error("Error fetching person details:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div>Loading...</div>; 

  // Combine all works (movies, shows, songs) into a single array
  const works = [...movies, ...shows, ...songs];

  // Slider settings: show the number of slides based on available works
  const slidesToShow = works.length < 5 ? works.length : 5;

  const settings = {
    dots: false,
    infinite: works.length > slidesToShow,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,            // Enable autoplay
    autoplaySpeed: 2000,       // Set speed for autoplay (2 seconds per slide)
    pauseOnHover: true,        // Optional: Pause slider when hovered over
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slidesToShow, 3),
          slidesToScroll: 1,
          infinite: works.length > 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
          slidesToScroll: 1,
          infinite: works.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: works.length > 1,
        },
      },
    ],
  };
  

  const shortBio = person.biography ? person.biography.slice(0, 150) : "";
  const isBiographyLong = person.biography && person.biography.length > 150; 

  return (
    <div className="container">
      {person && (
        <div className="person-details">
          <div className="person-info-container">
            {person.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="person-image"
              />
            )}
            <div className="person-info">
              <h2 className="display-4 text-shadow text-light">{person.name}</h2>
              
              {person.known_for_department && (
                <>
                  <h3>Department</h3>
                  <p>{person.known_for_department}</p>
                </>
              )}
              
              {person.place_of_birth && (
                <>
                  <h3>From</h3>
                  <p>{person.place_of_birth}</p>
                </>
              )}
              
              {person.birthday && (
                <>
                  <h3>Birthday</h3>
                  <p>{person.birthday}</p>
                </>
              )}
              
              {person.deathday && (
                <>
                  <h3>Deathday</h3>
                  <p>{person.deathday}</p>
                </>
              )}

              {person.biography && (
                <>
                  <h3>Biography</h3>
                  <p>
                    {showFullBio ? person.biography : shortBio}
                    {isBiographyLong && (
                      <span 
                        style={{ cursor: 'pointer', color: '#D98236' }} 
                        onClick={() => setShowFullBio(!showFullBio)}
                      >
                        {showFullBio ? ' ... See less' : ' ... See more'}
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {works.length > 0 && (
        <div className="person-works">
          <h2 className='display-4 text-shadow text-light'>Famous for:</h2>
          <Slider {...settings}>
            {movies.map(movie => (
              <Link key={movie.id} to={`/detailsmovie/${movie.id}`}>
                <div className="card bg-secondary text-light">
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="card-img-top"
                    />
                  )}
                  <div className="overlay">
                    <span className="movie-title">{movie.title}</span>
                  </div>
                </div>
              </Link>
            ))}
            {shows.map(show => (
              <Link key={show.id} to={`/detailstv/${show.id}`}>
                <div className="card bg-secondary text-light">
                  {show.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      className="card-img-top"
                    />
                  )}
                  <div className="overlay">
                    <span className="movie-title">{show.name}</span>
                  </div>
                </div>
              </Link>
            ))}
            {songs.map(song => (
              <div key={song.id} className="card bg-secondary text-light">
                {song.album_art && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${song.album_art}`}
                    alt={song.title}
                    className="card-img-top"
                  />
                )}
                <div className="overlay">
                  <span className="movie-title">{song.title}</span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
