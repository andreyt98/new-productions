import Hero from './Hero'
import Slider from './Slider'

const MovieSection = () => {

  return (
    <section>
        <Hero category={"trending"} mediaType={"movie"} limit={4}/> 
        <Slider category={"popular"} mediaType={"movie"} limit={7}/>
    </section>
  )
}

export default MovieSection