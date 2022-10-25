import Hero from "./Hero";
import Slider from "./Slider";

const TvSection = () => {
  return (
    <section className="tv-section">
      <Hero category={"popular"} mediaType={"tv"} limit={4} />
      <Slider title={"Popular"} category={"popular"} mediaType={"tv"} limit={7} />
    </section>
  );
};

export default TvSection;
