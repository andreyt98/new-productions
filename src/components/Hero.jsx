import { useState, useEffect, useContext } from 'react';
import { image } from '../helpers/api.config';
import { handleTrailerClick } from '../helpers/getTrailer';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';

const Hero = () => {
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const { currentId, setCurrentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    renderInitialContent();
    
  }, [apiData]);

  function renderInitialContent() {
    try {
      let mediaData;
      if (apiData.length > 0) {
        mediaData = currentMediaType === 'movies' ? apiData[0] : apiData[1];
        const [trendingResults] = mediaData;

        setResults(trendingResults);

        let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${trendingResults[0].backdrop_path}` : `${image({ size: 500 })}${trendingResults[0].poster_path}`;
        setHeroBackground(initialBackground);
        setTitle(trendingResults[0].name || trendingResults[0].title);
        setCurrentId(trendingResults[0].id);
      }
    } catch (e) {
      console.log('enter error here', e);
    }
  }

  function handleImageClick(event, result) {
    setCurrentId(result.id);

    const clickedElement = event.target.dataset.id;

    results.forEach((element) => {
      const elementExistInApi = clickedElement == element.id;

      if (elementExistInApi) {
        setHeroBackground(window.innerWidth >= 640 ? `${image({ size: 1280 })}${element.backdrop_path}` : `${image({ size: 500 })}${element.poster_path}`);
        setTitle(element.name || element.title);
      }
    });
  }

  return (
    <div className={'hero'} style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className='overlay'></div>      
          <div className='hero-media-selection'>
            <h1 className='title'>{title}</h1>

            <button
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              {' '}
              <span>
                <i className='bi bi-play-circle-fill '></i>
              </span>{' '}
              Play Trailer
            </button>

            <Link
              className='details'
              to={`${title}`}
            >
              <button> Details </button>
            </Link>
          </div>

          <div className='hero-media-thumbnails'>
            {results.slice(0, 4).map((result) => {
              return (
                <div
                  className={'movie ' + (currentId === result.id ? 'isActive' : '')}
                  onClick={(event) => {
                    handleImageClick(event, result);
                  }}
                  key={result.id}
                >
                  <img src={`${image({ size: 500 })}${result.poster_path}`} key={result.id} data-id={result.id} alt='media-image' />
                </div>
              );
            })}
          </div>
    </div>
  );
};

export default Hero;
