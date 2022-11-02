import Hero from './Hero'
import Slider from './Slider'

const MovieSection = ({openTrailer,setOpenTrailer}) => {
  return (
    <section>
        <Hero category={"trending"} mediaType={"movie"} limit={4} /> 
        <Slider category={"popular"} mediaType={"movie"} limit={7} openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>

    </section>
  )
}

export default MovieSection