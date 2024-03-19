import { useState, useEffect,useContext } from 'react';
import SliderCard from './SliderCard';
import { useRef } from 'react';
import { moveSlider } from '../helpers/moveSlider';
import { Context } from '../context/Context';

const Slider = () => {
  const [results, setResults] = useState([]);
  const {openTrailer, apiData,currentMediaType} = useContext(Context)
  const sliderRef = useRef();

  useEffect(() => {

    try{
      if (apiData.length > 0) {
         const mediaData = currentMediaType === 'movies' ? apiData[0] : apiData[1];
         const [,popularResults] = mediaData
         const [trendingResults] = mediaData

         setResults(currentMediaType == 'movies' ? popularResults : trendingResults.slice(5,20))     
      }
      }catch{}
  }, [apiData]);

  return (
    <div className='slider'>
      <div className='slider__header'>
        <h2>
          | { "POPULAR"}{' '}
          <span>
            {' '}
            {currentMediaType.toUpperCase()}
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

      <div className={`slider__content ${openTrailer && 'on-trailer'}` } ref={sliderRef}>
        {results.map((result) => {
          return <SliderCard result={result} />;
        })}
      </div>
    </div>
  );
};

export default Slider;
