import { useState, useEffect } from 'react';
import { fetchData } from '../helpers/fetchData';
import { image } from '../helpers/api.config';
import { getProvider } from '../helpers/getProviders';
import { getTrailer } from '../helpers/getTrailer';
import { Link } from 'react-router-dom';
import Trailer from './Trailer';
import { useContext } from 'react';
import { Context } from '../context/Context';

const Hero = ({ mediaType, category, limit }) => {
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [id, setId] = useState('');
  const [trailerKey, setTrailerKey] = useState('');
  const [openTrailer, setOpenTrailer] = useState('');
  const {setCurrentId} = useContext(Context)

  useEffect(() => {
    fetchData({ mediaType, category, limit }).then((data) => {
      const [firstResult] = data;
      let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${firstResult.backdrop_path}` : `${image({ size: 500 })}${firstResult.poster_path}`;

      data.forEach(() => {
        setResults(data);
        setHeroBackground(initialBackground);
        setTitle(firstResult.name || firstResult.title);
      });

      getProvider(firstResult.id, mediaType).then((providerData) => {
        const { results: providerResults } = providerData;
        const noProvider = Object.keys(providerData.results).length < 1;
        if (noProvider) {
          setProvider('');
          return;
        }

        if (providerResults) {
          Object.values(providerResults).map((result) => {
            if (providerResults.US != undefined) {
              if (providerResults.US.flatrate != undefined) {
                Object.values(providerResults.US.flatrate).map((flatrateResult, index) => {
                  if (index === 0) {
                    setProvider(flatrateResult.provider_name);
                  }
                });
              } else {
                Object.values(providerResults.US)[1].map((AnyResult, index) => {
                  if (index === 0) {
                    setProvider(AnyResult.provider_name);
                  }
                });
              }
            } else {
              Object.values(result)[1].map((fromAnyLanguage) => {
                setProvider(Object.values(fromAnyLanguage)[2]);
              });
            }
          });
        }
      });

      setId(firstResult.id);
    });
  }, []);

  function handleImageClick(event, result) {
    setId(result.id);

    results.forEach((element) => {
      if (event.target.dataset.id == element.id) {
        setHeroBackground(window.innerWidth >= 640 ? `${image({ size: 1280 })}${element.backdrop_path}` : `${image({ size: 500 })}${element.poster_path}`);
        setTitle(element.name || element.title);

        getProvider(element.id, mediaType).then((providerData) => {
          const noProvider = Object.keys(providerData.results).length < 1;
          if (noProvider) {
            setProvider('');
            return;
          }
          const { results } = providerData;

          if (results) {
            Object.values(results).map((result) => {
              if (results.US != undefined) {
                if (results.US.flatrate != undefined) {
                  Object.values(results.US.flatrate).map((flatrateResult, index) => {
                    if (index === 0) {
                      setProvider(flatrateResult.provider_name);
                    }
                  });
                } else {
                  Object.values(results.US)[1].map((AnyResult, index) => {
                    if (index === 0) {
                      setProvider(AnyResult.provider_name);
                    }
                  });
                }
              } else {
                Object.values(result)[1].map((fromAnyLanguage) => {
                  setProvider(Object.values(fromAnyLanguage)[2]);
                });
              }
            });
          }
        });
      }
    });
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

      <Trailer openTrailer={openTrailer} setOpenTrailer={setOpenTrailer} trailerKey={trailerKey} />
    </div>
  );
};

export default Hero;
