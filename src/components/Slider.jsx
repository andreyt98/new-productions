import { useState, useEffect } from 'react';
import { fetchData } from '../helpers/fetchData';
import Trailer from './Trailer';
import SliderCard from './SliderCard';


/*
TODO: move results state to App component to have it on every section and have different value based on type of search
(movie, tv or multisearch)
*/ 

const Slider = ({ mediaType, category, limit }) => {
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState('');
  const [trailerKey, setTrailerKey] = useState('');
  const [openTrailer, setOpenTrailer] = useState('');

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      data.forEach(() => {
        setResults(data);
      });
    });
  }, []);

  function moveSlider(e) {
    if (e.target.matches('.left')) {
      e.target.parentElement.parentElement.nextElementSibling.scrollBy(-(window.innerWidth / 2), 0);
    } else {
      e.target.parentElement.parentElement.nextElementSibling.scrollBy(window.innerWidth / 2, 0);
    }
  }

  return (
    <div className='slider'>
      <div className='slider__header'>
        <h2>
          | {category.toUpperCase()}{' '}
          <span>
            {' '}
            {mediaType.toUpperCase()}
            {mediaType === 'tv' ? ' SHOWS' : 'S'}{' '}
          </span>
        </h2>

        <div className='controls'>
          <i
            className='bi bi-chevron-left left'
            onClick={(e) => {
              moveSlider(e);
            }}
          ></i>
          <i
            className='bi bi-chevron-right right'
            onClick={(e) => {
              moveSlider(e);
            }}
          ></i>
        </div>
      </div>

      <div className='slider__content'>
        {results.map((result) => {
          return <SliderCard results={results} result={result} provider={provider} setProvider={setProvider} mediaType={mediaType} setTrailerKey={setTrailerKey} setOpenTrailer={setOpenTrailer} />;
        })}
        <div className='more'>
          <button className='more-btn'>More</button>
        </div>
      </div>

      <Trailer openTrailer={openTrailer} setOpenTrailer={setOpenTrailer} trailerKey={trailerKey} />
    </div>
  );
};

export default Slider;
