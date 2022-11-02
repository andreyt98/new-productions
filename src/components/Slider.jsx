import { useState, useEffect } from "react";
import { image } from "../helpers/api.config";
import { fetchData } from "../helpers/fetchData";

const Slider = ({mediaType, category, limit }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      data.forEach(() => {
        setResults(data);
      });
    });
  }, [Slider]);

  return (
    <div className="slider">
      <div className="slider__header">
        <h2>| {category.toUpperCase()} <span>{mediaType.toUpperCase()} SHOWS</span></h2>

        <div className="controls">
          <i className="bi bi-chevron-left left"></i>
          <i className="bi bi-chevron-right right"></i>
        </div>
      </div>

      <div className="slider__content">
        {results.map((element) => {
          return ( 
            <div className="content" key={element.id}>
              <div className="overlay">
              <i className="bi bi-play-circle-fill" data-id={element.id} onClick={()=>{}}></i>                            </div>
              <img src={`${image({ size: 500 })}${element.poster_path}`} alt=""/>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
