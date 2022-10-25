import { useState,useEffect } from "react";
import { fetchData} from "../helpers/fetchData";
import { imagePoster, imageWallpaper } from "../helpers/api.config";

const HeroSlider = ({category, mediaType, limit}) => {
  const [heroBackground, setHeroBackground] = useState("");
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchData({ category, mediaType, limit })
      .then((data) => {
        data.forEach(() => {
          setResults(data);
          setHeroBackground(window.innerWidth >= 600 ? `${imageWallpaper}${data[0].backdrop_path}` : `${imagePoster}${data[0].poster_path}`);
          setTitle(data[0].name || data[0].title );
          setActiveImage(data[0].id)
        });
      })
  }, [HeroSlider]);

  return (
    <div className="hero-slider" style={{ backgroundImage: `url(${heroBackground})` }}>
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
                src={window.innerWidth >= 600 ? `${imageWallpaper}${result.poster_path}` : `${imagePoster}${result.poster_path}`}
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

export default HeroSlider;
