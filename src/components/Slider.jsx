import { useState, useEffect } from "react";
import { imagePoster } from "../helpers/api.config";
import { fetchData } from "../helpers/fetchData";

const Slider = ({title, mediaType, category,  limit}) => {

  const [results, setResults] = useState([]);

  useEffect(()=>{
    fetchData({mediaType, category, limit})
    .then((data)=>{
      data.forEach(() => {
        setResults(data)
      });
    })
  },[Slider])

  return (
    <div className="slider">
      <div className="slider__header">
        <h2>{title.toUpperCase()}</h2>

        <div className="controls">
        <i className="bi bi-chevron-left left"></i>
        <i className="bi bi-chevron-right right"></i>
        </div>
      </div>

      <div className="slider__content">
        {results.map((element)=>{
          return(
            <img src={`${imagePoster}${element.poster_path}`} alt="" key={element.id} />
          )

        })}
      </div>
    </div>
  );
};

export default Slider;
