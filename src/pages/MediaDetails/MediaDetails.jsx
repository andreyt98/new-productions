import { useState, useEffect, useContext, useRef, useReducer } from 'react';
import { image } from '../../helpers/api.config';
import { handleTrailerClick } from '../../helpers/getTrailer';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../context/Context';
import { getById } from '../../helpers/getById';
import { getCast } from '../../helpers/getCast';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { mediaDetails_InitialState, mediaD_Actions, reducerFunction } from '../../helpers/reducerSelectedMedia';
import { getFromDB } from '../../firebase/getFromDB';
import { handle_favs_watchlists } from '../../firebase/handle_favs_watchlists';
import { getSimilar } from '../../helpers/getSimilar';
import SliderCard from '../../components/SliderCard';

const MediaDetails = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducerFunction, mediaDetails_InitialState);

  const [similar, setSimilar] = useState([]);
  const [loadingCast, setLoadingCast] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const { currentId, setOpenTrailer, setTrailerKey, currentMediaType, cast, setCast, userLogged, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } = useContext(Context);

  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const navigate = useNavigate();

  //error message component
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [routeKey, setRouteKey] = useState(0); // Agrega un estado para la clave

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(false);
  };
  // end of error message code

  useEffect(() => {
    window.scrollTo(0, 0);

    const mediaType = currentMediaType == 'movies' ? 'movie' : 'tv';

    getById(mediaType, currentId)
      .then((data) => {
        const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data;
        dispatch({
          type: mediaD_Actions.set_Media_Values,
          payload: {
            heroBackground: window.innerWidth >= 640 ? `${image({ size: 1280 })}${backdrop_path}` : `${image({ size: 500 })}${poster_path}`,
            title: title || original_name,
            poster: `${image({ size: 500 })}${poster_path}`,
            overview,
            releaseDate: release_date?.slice(0, 4) || first_air_date?.slice(0, 4),
            vote: String(vote_average).slice(0, 3),
            genres: genres.map((genre) => genre.name),
            loadingAllData: false,
          },
        });

        getCast(mediaType, currentId)
          .then((data) => {
            setCast(data);
            setLoadingCast(false);
          })
          .catch(() => {
            throw new Error();
          });

        getSimilar(mediaType, currentId)
          .then((data) => {
            setSimilar(data.results);
          })
          .catch(() => {
            throw new Error();
          });
      })
      .catch(() => {
        setLoadingCast(false);
      }); //todo: display error in screen

    if (userLogged) {
      getFromDB(firebaseActiveUser.uid, 'favorites', setAddedToFavs, setLoadingFavs, currentId);
      getFromDB(firebaseActiveUser.uid, 'watchlist', setAddedtoWatchList, setLoadingWatchlist, currentId);
    }
    setRouteKey((prevKey) => prevKey + 1);
  }, [id]);

  function handleBackClick() {
    window.scrollTo(0, 0);
    const fullPath = window.location.pathname;
    const lastPath = fullPath.lastIndexOf('/');
    navigate(fullPath.substring(0, lastPath));
  }

  return state.loadingAllData ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color='inherit' size={100} style={{ marginTop: '100px' }} />
    </div>
  ) : (
    <>
      <div className='media-details' style={{ backgroundImage: `url(${state.heroBackground})` }}>
        <div className='overlay'></div>
        <i className='bi bi-arrow-left' onClick={handleBackClick}></i>

        <div className='media-details__initial-content'>
          <div className='media-details__info-container'>
            <img src={state.poster} alt='' id='poster' />

            <div className='info-container-text'>
              <h1 className='title'>{state.title}</h1>
              <div className='info'>
                <span>{state.releaseDate}</span>
                <span>
                  {state.genres.slice(0, 1).join(', ', (genre) => {
                    return <span>{genre}</span>;
                  })}
                </span>
                <span>
                  <i className='bi bi-star-fill' style={{ color: 'yellow' }}></i>
                  {` ${state.vote}`}
                </span>
              </div>

              <div className='overview'>
                <div className='overview_data'>
                  <p>{state.overview}</p>
                </div>
              </div>
              <div className='options'>
                {userLogged && (
                  <>
                    {loadingFavs ? (
                      <CircularProgress color='inherit' size={10} />
                    ) : (
                      <Tooltip title={addedToFavs ? 'Delete from favorites' : 'Add to favorites'} placement='top'>
                        <i
                          data-id={currentId}
                          ref={mediaTypeRef}
                          data-mediatype={currentMediaType == 'movies' ? 'movie' : 'tv'}
                          id='favs-icon'
                          className={addedToFavs ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'}
                          style={{ fontSize: '200%' }}
                          onClick={() => {
                            handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef, state, 'favorites', setAddedToFavs, currentId, setErrorMessage, setShowError);
                          }}
                        ></i>
                      </Tooltip>
                    )}

                    {loadingWatchlist ? (
                      <CircularProgress color='inherit' size={10} />
                    ) : (
                      <Tooltip title={addedtoWatchList ? 'Delete from watchlist' : 'Add to watchlist'} placement='top'>
                        <i
                          data-id={currentId}
                          ref={mediaTypeRef2}
                          data-mediatype={currentMediaType == 'movies' ? 'movie' : 'tv'}
                          id='watchlist-icon'
                          className={addedtoWatchList ? 'bi bi-eye-fill' : 'bi bi-eye'}
                          onClick={() => {
                            handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef2, state, 'watchlist', setAddedtoWatchList, currentId, setErrorMessage, setShowError);
                          }}
                        ></i>
                      </Tooltip>
                    )}
                  </>
                )}
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
        </div>
      </div>
      <div className='extra-data'>
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Similar</h3>
          <p style={{ cursor: 'pointer' }}>see all <i className="bi bi-chevron-right"></i></p>
        </span>
        <div className='similar'>
          {similar.map((result) => {
            return <SliderCard result={result} changeMediaType={currentMediaType == 'movies' ? 'movie' : 'tv'} />;
          })}
        </div>

        <span style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <h3>Cast</h3>
          <p style={{ cursor: 'pointer' }}>see all <i className="bi bi-chevron-right"></i></p>
        </span>
        {loadingCast ? (
          <CircularProgress color='inherit' size={40} />
        ) : (
          cast && (
            <div className='cast'>
              {cast.map((cast) => {
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
          )
        )}
      </div>

      <Snackbar open={showError} autoHideDuration={3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' variant='filled' sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MediaDetails;