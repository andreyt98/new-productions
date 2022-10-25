import HeroSlider from "./HeroSlider";

const TvSection = () => {
  return (
    <section className="tv-section">
      <HeroSlider category={"trending"} mediaType={"tv"} limit={4} />
    </section>
  );
};

export default TvSection;
