import { useState,useEffect } from "react";
import { fetchData} from "../helpers/fetchData";
import { image} from "../helpers/api.config";

const Hero = ({mediaType, category, limit}) => {
  const [heroBackground, setHeroBackground] = useState("");
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchData({ mediaType, category, limit })
      .then((data) => {
        const [firstResult] = data;
        let initialBackground = window.innerWidth >= 600 ? `${image({size: 1280})}${firstResult.backdrop_path}` :`${image({size: 500})}${firstResult.poster_path}`

        data.forEach(() => {
          setResults(data);
          setHeroBackground(initialBackground);
          setTitle(firstResult.name || firstResult.title );
          setActiveImage(firstResult.id)
        });
      })
  }, [Hero]);

  function handleImageClick(event, result) {

    setActiveImage(result.id)

    results.forEach((element)=>{
        if(event.target.dataset.id == element.id){
        setHeroBackground(window.innerWidth >= 640? `${imageWallpaper}${element.backdrop_path}` : `${imagePoster}${element.poster_path}`)
        setTitle(element.name || element.title );
        }
    })
  }

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className="overlay"></div>
      <div className="info">
        <h1 className="title">{title}</h1>

        <button> <span><i className="bi bi-play-circle-fill"></i></span> Play</button>
        {/* <p>text</p> */}
      </div>

      <div className="movies">
        {results.map((result) => {
            return (
              <img
                src={window.innerWidth >= 600 ? `${image({size: 1280})}${result.backdrop_path}` :`${image({size: 500})}${result.poster_path}`}
                className={activeImage === result.id ? "isActive" : ""}
                key={result.id}
                data-id={result.id}
                alt="media-image" 
                onClick={(event) => {handleImageClick(event, result)}}
              />
            )
        })}
      </div>
    </div>
  );
};

export default Hero;
