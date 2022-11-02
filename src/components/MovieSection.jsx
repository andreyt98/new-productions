import Hero from './Hero'

const MovieSection = () => {
  return (
    <section>
        <Hero category={"trending"} mediaType={"movie"} limit={4} /> 
    </section>
  )
}

export default MovieSection