import Hero from "./Hero";
import Slider from "./Slider";

const TvSection = ({openTrailer,setOpenTrailer}) => {
  return (
    <section className="tv-section">
      <Hero category={"trending"} mediaType={"tv"} limit={4} />
      <Slider category={"popular"} mediaType={"tv"} limit={7} openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>
    </section>
  );
};

export default TvSection;
