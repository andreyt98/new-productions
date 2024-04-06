import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import SliderCard from '../../components/SliderCard';
import { Context } from '../../context/Context';
import SearchForm from './SearchForm';

const SearchSection = () => {
  const [results, setResults] = useState([]);
  const { openTrailer } = useContext(Context);

  return (
    <section className={`search-section ${openTrailer && 'on-trailer'}`}>
      <h1>Search for something!</h1>
      <SearchForm setResults={setResults} />
      <div className='results'>
        {results == null ? (
          <img src='../../../public/spinner.gif' alt='' className='spinner' />
        ) : (
          results.map((result) => {
            if (result.media_type !== 'person' && result.media_type) {
              return <SliderCard result={result} changeMediaType={result.media_type} />;
            }
          })
        )}
      </div>
    </section>
  );
};

export default SearchSection;
