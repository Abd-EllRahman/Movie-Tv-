import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './AAA-removebg-preview.png';
import 'font-awesome/css/font-awesome.css';
import axios from 'axios';
import './Navbar.css'; // Import custom CSS

export default function Navbar({ loginData, Logout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalSearchQuery, setInternalSearchQuery] = useState(''); // Separate state for internal search bar
  const [searchResults, setSearchResults] = useState({
    movies: [],
    tvShows: [],
    people: [],
  });
  const [showResults, setShowResults] = useState(false);
  const apiKey = '44ee5523e457e74020effc2bddc4592e'; // Replace with your TMDB API Key

  // Define keywords or genres to filter out sexual content
  const forbiddenKeywords = ['adult', 'erotic', 'nude', 'nudity', 'tits'];

  const filterResults = (results) => {
    return results.filter(item => {
      const title = item.title || item.name || item.original_title || '';
      return !forbiddenKeywords.some(keyword => title.toLowerCase().includes(keyword));
    });
  };

  // Fetch results based on a given query
  const fetchResults = async (query) => {
    if (!query) {
      setSearchResults({ movies: [], tvShows: [], people: [] });
      return;
    }

    try {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false`
      );
      const tvResponse = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}&include_adult=false`
      );
      const personResponse = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}&include_adult=false`
      );

      const filteredMovies = filterResults(movieResponse.data.results || []);
      const filteredTvShows = filterResults(tvResponse.data.results || []);
      const filteredPeople = filterResults(personResponse.data.results || []);

      const results = {
        movies: filteredMovies,
        tvShows: filteredTvShows,
        people: filteredPeople,
      };

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        fetchResults(searchQuery);
      }
    }, 300);

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, apiKey]);

  // Effect to trigger search based on internalSearchQuery
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResults(internalSearchQuery);
    }, 300);

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalSearchQuery, apiKey]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  const placeholderImage = 'https://via.placeholder.com/500x750.png?text=Image+Not+Available';

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top text-white" style={{ backgroundColor: 'transparent' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/">
            <img src={logo} alt="Logo" style={{ height: '100px', width: '120px', marginTop: '10px' }} />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {loginData ? (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" style={{ color: '#D98236' }} aria-current="page" to="/home" onClick={handleScrollToTop}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/movie" onClick={handleScrollToTop}>Movies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/tv" onClick={handleScrollToTop}>Tv</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/animation" onClick={handleScrollToTop}>Animation</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/people" onClick={handleScrollToTop}>Celebrities</Link>
                </li>
                <li>
                  <div className="input-group">
                    <input
                      className="search-bar form-control"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowResults(true)} // Show results box when focused
                    />
                    <span className="input-group-text" onClick={() => setShowResults(true)}>
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </span>
                  </div>
                </li>
              </ul>
            ) : ""}

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {loginData ? (
                <li className="nav-item">
                  <Link onClick={Logout} className="nav-link text-white">Log out</Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="" onClick={handleScrollToTop}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/register" onClick={handleScrollToTop}>Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showResults && (
        <div className="styled-box">
          <div className="styled-box-header">
            <h5>Search Results</h5>
            <button type="button" className="close" onClick={() => setShowResults(false)}>
              &times;
            </button>
          </div>
          <div className="styled-box-body">
            <div className="input-group mb-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search within results"
                value={internalSearchQuery}
                onChange={(e) => setInternalSearchQuery(e.target.value)}
              />
            </div>
            <div className="row">
              {searchResults.movies.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: '0', color: '#D98236' }}>Movie</h2>
                    <div style={{
                      flexGrow: 1,
                      height: '2px',
                      backgroundColor: '#D98236',
                      marginLeft: '10px'
                    }} />
                  </div>
                  {searchResults.movies.map(movie => (
                    <div className="col-4 col-md-3 mb-3" key={movie.id}>
                      <div className="card smaller-card">
                        <Link to={`/detailsmovie/${movie.id}`} onClick={() => { handleScrollToTop(); handleResultClick(); }}>
                          <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage} className="card-img-top" alt={movie.title || 'Movie Poster'} />
                          <div className="overlay">
                            <span className="movie-title">{movie.title}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {searchResults.tvShows.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: '0', color: '#D98236' }}>TV</h2>
                    <div style={{
                      flexGrow: 1,
                      height: '2px',
                      backgroundColor: '#D98236',
                      marginLeft: '10px'
                    }} />
                  </div>
                  {searchResults.tvShows.map(tv => (
                    <div className="col-4 col-md-3 mb-3" key={tv.id}>
                      <div className="card smaller-card">
                        <Link to={`/detailstv/${tv.id}`} onClick={() => { handleScrollToTop(); handleResultClick(); }}>
                          <img src={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : placeholderImage} className="card-img-top" alt={tv.name || 'TV Show Poster'} />
                          <div className="overlay">
                            <span className="movie-title">{tv.name}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {searchResults.people.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: '0', color: '#D98236' }}>Celebrities</h2>
                    <div style={{
                      flexGrow: 1,
                      height: '2px',
                      backgroundColor: '#D98236',
                      marginLeft: '10px'
                    }} />
                  </div>
                  {searchResults.people.map(person => (
                    <div className="col-4 col-md-3 mb-3" key={person.id}>
                      <div className="card smaller-card">
                        <Link to={`/detailsperson/${person.id}`} onClick={() => { handleScrollToTop(); handleResultClick(); }}>
                          <img src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : placeholderImage} className="card-img-top" alt={person.name || 'Celebrity Poster'} />
                          <div className="overlay">
                            <span className="movie-title">{person.name}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {searchResults.movies.length === 0 && searchResults.tvShows.length === 0 && searchResults.people.length === 0 && (
                <div className="col-12">
                  <p>No results found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
