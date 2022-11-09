import Hero from "./Hero";
import Slider from "./Slider";

const TvSection = ({trailerKey, setTrailerKey,openTrailer,setOpenTrailer}) => {
  return (
    <section className="tv-section">
      <Hero category={"trending"} mediaType={"tv"} limit={4} trailerKey={trailerKey} setTrailerKey={setTrailerKey}  openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>
      <Slider category={"popular"} mediaType={"tv"} limit={7} trailerKey={trailerKey} setTrailerKey={setTrailerKey} openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>
    </section>
  );
};

export default TvSection;
