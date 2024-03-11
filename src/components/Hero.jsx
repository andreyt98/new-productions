import { useState, useEffect, useContext } from 'react';
import { image } from '../helpers/api.config';
import { assignProvider } from '../helpers/getProviders';
import { handleTrailerClick } from '../helpers/getTrailer';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import { getById } from '../helpers/getById';
import { getCast } from '../helpers/getCast';

const Hero = ({ isMediaSelected = false }) => {
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [poster, setPoster] = useState('');

  const { currentId, setCurrentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType, reviews, setReviews, cast, setCast } = useContext(Context);

  // for info
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [vote, setVote] = useState(0);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isMediaSelected) {
      renderInitialContent();
      return;
    }
    const mediaType = currentMediaType == 'movies' ? 'movie' : 'tv';

    getById(mediaType, currentId).then((data) => {
      const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data;
      setResults({ title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path });

      setTitle(title || original_name);
      setOverview(overview);
      setReleaseDate(release_date?.slice(0, 4) || first_air_date?.slice(0, 4));
      setGenres(genres.map((genre) => genre.name));
      setVote(String(vote_average).slice(0, 1));
      let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${backdrop_path}` : `${image({ size: 500 })}${poster_path}`;

      setHeroBackground(initialBackground);
      let post = `${image({ size: 500 })}${poster_path}`;
      setPoster(post);

      getCast(mediaType, currentId).then((data) => {
        setCast(data);
      });
    });
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
        assignProvider(trendingResults[0].id, currentMediaType, setProvider);
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
        assignProvider(element.id, currentMediaType, setProvider);
      }
    });
  }
  function handleBackClick() {
    window.scrollTo(0, 0);
    const fullPath = window.location.pathname;
    const lastPath = fullPath.lastIndexOf('/');
    navigate(fullPath.substring(0, lastPath));
  }
  return (
    <div className={isMediaSelected ? 'hero-info' : 'hero'} style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className='overlay'></div>

      {isMediaSelected ? (
        <>
          <i className='bi bi-arrow-left' onClick={handleBackClick}></i>
          <div className='hero-selected-media'>
            <div className='selected-media-info-container'>
              <img src={poster} alt='' id='poster' />

              <div className='selected-media-info'>
                <h1 className='title'>{title}</h1>
                <div className='info'>
                  <span>{releaseDate}</span>
                  <span>
                    {genres.slice(0, 1).join(', ', (genre) => {
                      return <span>{genre}</span>;
                    })}
                  </span>
                  <span>
                    <i className='bi bi-star-fill' style={{ color: 'yellow' }}></i>
                    {` ${vote}`}
                  </span>
                </div>

                <div className='overview'>
                  <div className='overview_data'>
                    <p>{overview}</p>
                  </div>
                </div>
                <div className='options'>
                  <button
                    data-id={currentId}
                    onClick={() => {
                      handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
                    }}
                  >
                    Play Trailer
                  </button>
                </div>
              </div>
            </div>

            <section className='selected-media-cast'>
              <h3>Cast</h3>
              <div className='cast'>
                {cast &&
                  cast.map((cast) => {
                    return (
                      <div className='cast__member' key={cast.id + 543425}>
                        <img
                          src={
                            cast.profile_path
                              ? `${image({ size: 500 })}${cast.profile_path}`
                              : 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
                          }
                          alt='cast-member'
                        />
                        <p className='cast__member__name'>{cast.name}</p>
                        <p className='cast__member__character'>{cast.character}</p>
                      </div>
                    );
                  })}
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Hero;
