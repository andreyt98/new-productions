import { useState, useEffect, useContext } from 'react';
import { image } from '../helpers/api.config';
import { assignProvider } from '../helpers/getProviders';
import { handleTrailerClick } from '../helpers/getTrailer';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';

const Hero = () => {
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [id, setId] = useState('');
  const { setCurrentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType } = useContext(Context);

  useEffect(() => {
    renderContent();
  }, [apiData]);

  function renderContent() {
    try {
      let mediaData;
      if (apiData.length > 0) {
        mediaData = currentMediaType === 'movies' ? apiData[0] : apiData[1];
        const [trendingResults] = mediaData

        setResults(trendingResults);

        let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${trendingResults[0].backdrop_path}` : `${image({ size: 500 })}${trendingResults[0].poster_path}`;
        setHeroBackground(initialBackground);
        setTitle(trendingResults[0].name || trendingResults[0].title);
        setId(trendingResults[0].id);
        assignProvider(trendingResults[0].id,currentMediaType,setProvider);
      }

    } catch (e) {
      console.log('enter error here', e);
    }
  }
  function handleImageClick(event, result) {
    setId(result.id);

    const clickedElement = event.target.dataset.id;

    results.forEach((element) => {
      const elementExistInApi = clickedElement == element.id;

      if (elementExistInApi) {
        setHeroBackground(window.innerWidth >= 640 ? `${image({ size: 1280 })}${element.backdrop_path}` : `${image({ size: 500 })}${element.poster_path}`);
        setTitle(element.name || element.title);
        assignProvider(element.id,currentMediaType,setProvider);
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
            handleTrailerClick(setOpenTrailer,id,currentMediaType,setTrailerKey);
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
