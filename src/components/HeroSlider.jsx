
const HeroSlider = () => {

  return (
    <div className="hero-slider" style={{ backgroundImage: `url(${"heroBackground"})` }}>
      <div className="overlay"></div>
      <div className="info">
        <h1 className="title">{"title"}</h1>

        <button> <span><i className="bi bi-play-circle-fill"></i></span> Play</button>
        {/* <p>text</p> */}
      </div>

      <div className="movies">
      </div>
    </div>
  );
};

export default HeroSlider;
