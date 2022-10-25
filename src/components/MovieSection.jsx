import HeroSlider from './HeroSlider'

const MovieSection = () => {
  return (
    <section>
        <HeroSlider category={"trending"} mediaType={"movie"} limit={4} /> 
    </section>
  )
}

export default MovieSection