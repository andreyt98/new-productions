import { useState, useEffect, useContext } from 'react';
import { image } from '../helpers/api.config';
import { handleTrailerClick } from '../helpers/getTrailer';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import { getById } from '../helpers/getById';
import { getCast } from '../helpers/getCast';

const SelectedMedia = () => {
  const [heroBackground, setHeroBackground] = useState('');
  const [, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');

  const { currentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType, cast, setCast } = useContext(Context);
  
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [vote, setVote] = useState(0);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
   
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

  function handleBackClick() {
    window.scrollTo(0, 0);
    const fullPath = window.location.pathname;
    const lastPath = fullPath.lastIndexOf('/');
    navigate(fullPath.substring(0, lastPath));
  }

  return (
    <div className={'hero-info'} style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className='overlay'></div>

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
    </div>
  );
};

export default SelectedMedia;
