import { useState, useEffect } from 'react';
import { fetchData } from '../helpers/fetchData';
import Trailer from './Trailer';
import SliderCard from './SliderCard';
import { useRef } from 'react';
import { moveSlider } from '../helpers/moveSlider';

const Slider = ({ mediaType, category, limit }) => {
  const [results, setResults] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [openTrailer, setOpenTrailer] = useState('');
  const sliderRef = useRef();

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      data.forEach(() => {
        setResults(data);
      });
    });
  }, []);

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
            onClick={(event) => {
              moveSlider(event,sliderRef)
            }}
          ></i>
          <i
            className='bi bi-chevron-right right'
            onClick={(event) => {
              moveSlider(event,sliderRef)
            }}
          ></i>
        </div>
      </div>

      <div className='slider__content' ref={sliderRef}>
        {results.map((result) => {
          return <SliderCard results={results} result={result} mediaType={mediaType} setOpenTrailer={setOpenTrailer} setTrailerKey={setTrailerKey} key={result.id} />;
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
