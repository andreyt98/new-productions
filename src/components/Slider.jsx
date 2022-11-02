import { useState, useEffect } from "react";
import { image } from "../helpers/api.config";
import { fetchData } from "../helpers/fetchData";
import { getMovies } from "../helpers/getMovies";
import Trailer from "./Trailer";

const Slider = ({ mediaType, category, limit, openTrailer, setOpenTrailer }) => {
  const [results, setResults] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      data.forEach(() => {
        setResults(data);
      });
    });
  }, [Slider]);

  function handleTrailerClick(id) {
    getMovies(id, mediaType).then((data) => {
      data.results.forEach((element) => {
        if (element.type === "Trailer") {
          setTrailerKey(element.key);
          setOpenTrailer(true)         
        }
      });
    });
  }

  function moveSlider (e){

    if(e.target.matches('.left')){
      e.target.parentElement.parentElement.nextElementSibling.scrollBy(-(window.innerWidth / 2), 0)
      
    }else{
     e.target.parentElement.parentElement.nextElementSibling.scrollBy((window.innerWidth / 2), 0)

    }
  }
  return (
    <div className="slider">
      <div className="slider__header">
        <h2>
          | {category.toUpperCase()} <span>{mediaType.toUpperCase()}{mediaType === 'tv'? ' SHOWS' : 'S' }</span>
        </h2>

        <div className="controls">
          <i className="bi bi-chevron-left left" onClick={(e)=>{moveSlider(e)}}></i>
          <i className="bi bi-chevron-right right" onClick={(e)=>{moveSlider(e)}}></i>
        </div>
      </div>

      <div className="slider__content">
        {results.map((element) => {
          return (
            <div className="content" key={element.id}>
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
        })}
      </div>

      <Trailer openTrailer={openTrailer} setOpenTrailer={setOpenTrailer} trailerKey={trailerKey}/>
    </div>
  );
};

export default Slider;
