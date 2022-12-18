import React from 'react';
import { useState } from 'react';
import SliderCard from '../../components/SliderCard';
import Trailer from '../../components/Trailer';
import SearchForm from './SearchForm';

const SearchSection = () => {
  const [results, setResults] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [openTrailer, setOpenTrailer] = useState('');

  return (
    <section className='search-section'>
      <h1>Search for something!</h1>
      <SearchForm setResults={setResults} />
      <div className='results'>
        {results==null ? (
          <img src='../../../public/spinner.gif' alt='' className='spinner' />
        ) : (
          results.map((result) => {
            if (result.media_type !== 'person') {
              return <SliderCard results={results} result={result} mediaType={result.media_type} setOpenTrailer={setOpenTrailer} setTrailerKey={setTrailerKey} key={result.id} />;
            }
          })
        )}

        <Trailer openTrailer={openTrailer} setOpenTrailer={setOpenTrailer} trailerKey={trailerKey} />
      </div>
    </section>
  );
};

export default SearchSection;
