import Hero from './Hero'
import Slider from './Slider'

const MovieSection = ({trailerKey, setTrailerKey,openTrailer,setOpenTrailer}) => {
  return (
    <section>
        <Hero category={"trending"} mediaType={"movie"} limit={4} trailerKey={trailerKey} setTrailerKey={setTrailerKey} openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/> 
        <Slider category={"popular"} mediaType={"movie"} limit={7} trailerKey={trailerKey} setTrailerKey={setTrailerKey} openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>

    </section>
  )
}

export default MovieSection