import React from "react";
import SearchForm from "./SearchForm";


const SearchSection = ({ searchSection }) => {
  if (!searchSection) return null;

  return (
    <section className="search-section">
      <h1>Search for something!</h1>
      <SearchForm/>
      <div className="results">
        <p>results</p>
      </div>
    </section>
  );
};

export default SearchSection;