import { useState, useEffect, useContext, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../context/Context';
import { image, imageWithSize } from '../../helpers/api.config';
import { getById } from '../../helpers/getById';
import { getCast } from '../../helpers/getCast';
import { getReviews } from '../../helpers/getReviews';
import { getSimilar } from '../../helpers/getSimilar';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { mediaDetails_InitialState, mediaD_Actions, reducerFunction } from '../../helpers/reducerSelectedMedia';
import { getFromDB } from '../../firebase/getFromDB';
import NotFound from '../../components/NotFound';
import Similar from '../../components/Similar';
import Cast from '../../components/Cast';
import { Reviews } from '../../components/Reviews';
import MediaInfo from '../../components/MediaInfo';

const MediaDetails = () => {
  const { id: idFromUrl } = useParams();
  const [state, dispatch] = useReducer(reducerFunction, mediaDetails_InitialState);

  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingCast, setLoadingCast] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const { setCurrentId, currentId, currentMediaType, setCast, userLogged, setAddedToFavs, setAddedtoWatchList, firebaseActiveUser } = useContext(Context);

  const similarContainerRef = useRef(null);
  const castContainerRef = useRef(null);
  const [similarMaximized, setSimilarMaximized] = useState(false);
  const [castMaximized, setCastMaximized] = useState(false);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });

  const [routeKey, setRouteKey] = useState(0); // Agrega un estado para la clave

  useEffect(() => {
    if (idFromUrl != currentId) {
      setCurrentId(idFromUrl);
    }
  }, [idFromUrl]);

  useEffect(() => {
    if (idFromUrl == currentId) {
      dispatch({ type: mediaD_Actions.set_All_DataLoader, payload: { loadingAllData: true } });

      window.scrollTo(0, 0);
      setCastMaximized(false);
      const mediaType = currentMediaType == 'movies' ? 'movie' : 'tv';

      getById(mediaType, currentId)
        .then((data) => {
          if (data.status_code === 6) {
            throw new Error('id not found');
          }
          const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data;
          dispatch({
            type: mediaD_Actions.set_Media_Values,
            payload: {
              results: [data],
              heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
              title: title || original_name,
              poster: `${imageWithSize('780')}${poster_path}`,
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

          getReviews(mediaType, currentId)
            .then((data) => {
              setReviews(data.results);
            })
            .catch(() => {
              throw new Error();
            });
        })
        .catch((er) => {
          setLoadingCast(false);
          dispatch({ type: mediaD_Actions.set_All_DataLoader, payload: { loadingAllData: false } });
        }); //todo: display error in screen

      if (userLogged) {
        getFromDB(firebaseActiveUser.uid, 'favorites', setAddedToFavs, setLoadingFavs, currentId);
        getFromDB(firebaseActiveUser.uid, 'watchlist', setAddedtoWatchList, setLoadingWatchlist, currentId);
      }
      setRouteKey((prevKey) => prevKey + 1);

      setSimilarMaximized(false);

      if (similarContainerRef.current) {
        similarContainerRef.current.style.height = '350px';
      }
      if (castContainerRef.current) {
        castContainerRef.current.style.height = '200px';
      }
    }
  }, [currentId]);

  return state.loadingAllData ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color='inherit' size={100} style={{ marginTop: '100px' }} />
    </div>
  ) : !state.loadingAllData && state.results.length > 0 ? (
    <div style={{ paddingBlockEnd: '7rem' }}>
      <MediaInfo state={state} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />

      <div className='extra-data'>
        <Similar similar={similar} />
        <Cast />
        <Reviews reviews={reviews} />
      </div>

      <Snackbar
        open={message.open}
        autoHideDuration={3500}
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setMessage({ ...message, open: false });
          }}
          severity='error'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <NotFound />
  );
};

export default MediaDetails;
