import { useState, useEffect,useContext } from 'react';
import { fetchData } from '../helpers/fetchData';
import { image } from '../helpers/api.config';
import { getProvider } from '../helpers/getProviders';
import { getTrailer } from '../helpers/getTrailer';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';

const Hero = ({ mediaType, category, limit }) => {
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [id, setId] = useState('');
  const { setCurrentId,setOpenTrailer,setTrailerKey} = useContext(Context)

  async function callFetch({ mediaType, category, limit }){
    try{
      const data = await fetchData({ mediaType, category, limit })

      if(data.length>0){
        const [firstResult] = data;
        let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${firstResult.backdrop_path}` : `${image({ size: 500 })}${firstResult.poster_path}`;
    
        data.forEach(() => {
          setResults(data);
          setHeroBackground(initialBackground);
          setTitle(firstResult.name || firstResult.title);
        });
    
        assignProvider(firstResult)

        setId(firstResult.id);
      }else{
        throw new Error
      }
    }catch(e){     
      console.log("enter error here")
    }
  }

  useEffect( () => {

      callFetch({ mediaType, category, limit })

  }, []);

  function handleImageClick(event, result) {
    setId(result.id);

    const clickedElement = event.target.dataset.id
    
    results.forEach((element) => {

      const elementExistInApi = clickedElement == element.id

      if (elementExistInApi) {
        setHeroBackground(window.innerWidth >= 640 ? `${image({ size: 1280 })}${element.backdrop_path}` : `${image({ size: 500 })}${element.poster_path}`);
        setTitle(element.name || element.title);
        assignProvider(element)
      }
    });
  }


const assignProvider = async (element) =>{

  try{
    const providerResults = await getProvider(element.id, mediaType);

    const noProvider = Object.keys(providerResults.results).length < 1;
    if (noProvider) {
      setProvider('');
      return;
    }

    const { results } = providerResults;

    if (results) {
      Object.values(results).map((result) => {
        results.US? setProviderFromUsa(results) : setProvider(Object.values(result)[1][0].provider_name)       
      });
    }

  }catch{
    console.log("error on provider")
  }

}

  const setProviderFromUsa = (results)=> {

    if (results.US.flatrate) {
      setProvider( Object.values(results.US.flatrate[0].provider_name));

    } else { 
      setProvider( Object.values(results.US)[1][0].provider_name);
    }
  }

  function handleTrailerClick(id) {
    setOpenTrailer(true);
    getTrailer(id, mediaType).then((data) => {
      if(data.results.length<1){
        setTrailerKey(null)
      }else{
        data.results.forEach((element) => {
          if (element.type === 'Trailer') {
            setTrailerKey(element.key);
          }
        });
      }
    });
  }

  return (
    <div className='hero' style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className='overlay'></div>
      <div className='info'>
        <h1 className='title'>
          {title}
          <span className='provider'> {provider}</span>
        </h1>
        <button
          data-id={id}
          onClick={() => {
            handleTrailerClick(id);
          }}
        >
          {' '}
          <span>
            <i className='bi bi-play-circle-fill '></i>
          </span>{' '}
          Play Trailer
        </button>
      </div>

      <div className='movies'>
        {results.map((result) => {
          return (
            <div
              className={'movie ' + (id === result.id ? 'isActive' : '')}
              onClick={(event) => {
                handleImageClick(event, result);
              }}
              key={result.id}
            >
              <img src={`${image({ size: 500 })}${result.poster_path}`} key={result.id} data-id={result.id} alt='media-image' />
              <Link
                to={`${title}`}
                onClick={() => {
                  setCurrentId(id);
                }}
              >
                <i className='bi bi-arrow-right-circle-fill more' style={{ display: id === result.id ? 'block' : '' }}></i>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
