import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './People.css';
import { Link } from 'react-router-dom';

export default function People() {
  let [people, setPeople] = useState([]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function getData() {
    try {
      // Fetch trending persons with include_adult=false
      let { data: trendingData } = await axios.get(
        `https://api.themoviedb.org/3/trending/person/day?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`
      );

      // Fetch popular persons with include_adult=false
      let { data: popularData } = await axios.get(
        `https://api.themoviedb.org/3/person/popular?api_key=44ee5523e457e74020effc2bddc4592e&include_adult=false`
      );

      // Combine the two arrays of results
      const combinedPeople = [...trendingData.results, ...popularData.results];

      // Remove duplicates (based on person ID)
      const uniquePeople = combinedPeople.filter(
        (person, index, self) =>
          index === self.findIndex((p) => p.id === person.id)
      );

      setPeople(uniquePeople);
    } catch (error) {
      console.error('Error fetching person data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          {people.map((ele, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card h-100 w-100">
                <Link to={`/detailsperson/${ele.id}`} onClick={handleScrollToTop}>
                  <img
                    src={
                      ele.profile_path
                        ? `https://image.tmdb.org/t/p/w500${ele.profile_path}`
                        : 'https://via.placeholder.com/500x750.png?text=Image+Not+Available'
                    }
                    className="card-img-top"
                    style={{ border: '2px inset #D98236' }}
                    alt={ele.title || 'Image not available'}
                  />
                  <div className="overlay">
                    <span className="movie-title">{ele.name}</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
