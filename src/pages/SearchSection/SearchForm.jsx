import React from 'react';
import { search } from '../../helpers/search';

const SearchForm = ({ setResults }) => {
  function handleSearch(e) {
    e.preventDefault();
    search(e.target.firstElementChild.value).then((data) => {
      setResults(data.results);
    });
  }
  return (
    <form
      className='searchForm'
      onSubmit={(e) => {
        handleSearch(e);
      }}
    >
      <input type='search' placeholder='Search something...' />
      <button type='submit'>search</button>
    </form>
  );
};

export default SearchForm;
