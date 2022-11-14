import React from "react";
import { useState } from "react";
import { image } from "../../helpers/api.config";
import SearchForm from "./SearchForm";

const SearchSection = () => {
  const [results, setResults] = useState([]);

  return (
    <section className="search-section">
      <h1>Search for something!</h1>
      <SearchForm setResults={setResults} />
      <div className="results">
        {results.map((element) => {
          if (element.media_type !== "person") {
            return (
              <div className="content">
                <div className="overlay">
                  <i
                    className="bi bi-play-circle-fill"
                    data-id={element.id}
                    onClick={() => {
                      handleTrailerClick(element.id);
                    }}
                  ></i>{" "}
                </div>
                <img src={`${image({ size: 500 })}${element.poster_path}`} alt="" />
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

export default SearchSection;
