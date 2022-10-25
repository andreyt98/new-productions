import Hero from './Hero'

const MovieSection = () => {
  return (
    <section>
        <Hero category={"popular"} mediaType={"movie"} limit={4} /> 
    </section>
  )
}

export default MovieSection