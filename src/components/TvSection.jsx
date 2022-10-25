import Hero from "./Hero";
import Slider from "./Slider";

const TvSection = () => {
  return (
    <section className="tv-section">
      <Hero category={"trending"} mediaType={"tv"} limit={4} />
      <Slider/>      
    </section>
  );
};

export default TvSection;
