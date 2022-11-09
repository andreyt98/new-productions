import { useState, useEffect } from "react";
import { fetchData } from "../helpers/fetchData";
import { image } from "../helpers/api.config";
import { getProvider } from "../helpers/getProviders";

const Hero = ({ mediaType, category, limit,trailerKey, setTrailerKey }) => {
  const [heroBackground, setHeroBackground] = useState("");
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [provider, setProvider] = useState("");

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      const [firstResult] = data;
      let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${firstResult.backdrop_path}` : `${image({ size: 500 })}${firstResult.poster_path}`;

      data.forEach(() => {
        setResults(data);
        setHeroBackground(initialBackground);
        setTitle(firstResult.name || firstResult.title);
        setActiveImage(firstResult.id);
      });

      getProvider(firstResult.id, mediaType).then((providerData) => {
        if (providerData.results.US) {
          setProvider("(" + providerData.results.US.flatrate[0].provider_name + ")");
        } else {
          setProvider("");
        }
      });
    });
  }, []);

  function handleImageClick(event, result) {
    setActiveImage(result.id);

    results.forEach((element) => {
      if (event.target.dataset.id == element.id) {
        setHeroBackground(window.innerWidth >= 640 ? `${image({ size: 1280 })}${element.backdrop_path}` : `${image({ size: 500 })}${element.poster_path}`);
        setTitle(element.name || element.title);

        getProvider(element.id, mediaType).then((providerData) => {
          if (providerData.results.US) {
            setProvider("(" + providerData.results.US.flatrate[0].provider_name + ")");
          } else {
            setProvider("");
          }
        });
      }
    });
  }

  

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className="overlay"></div>
      <div className="info">
        <h1 className="title">
          {title}
          <span className="provider"> {provider}</span>
        </h1>
        <button> <span> 
        <i className="bi bi-play-circle-fill "></i>
        </span>{" "} 
        Play Trailer
         </button>
      </div>

      <div className="movies">
        {results.map((result) => {
          return (
            <div
              className={ "movie " + (activeImage === result.id ? "isActive" : "")}
              onClick={(event) => {
                handleImageClick(event, result);
              }}
            >
              <img src={`${image({ size: 500 })}${result.poster_path}`} key={result.id} data-id={result.id} alt="media-image" />
              <i className="bi bi-arrow-right-circle-fill more" style={{display: (activeImage === result.id ? "block" : "")}}></i>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
