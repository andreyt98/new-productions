import { useState, useEffect, useContext, useRef } from 'react';
import { image } from '../helpers/api.config';
import { handleTrailerClick } from '../helpers/getTrailer';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import { getById } from '../helpers/getById';
import { getCast } from '../helpers/getCast';
import { database } from '../firebase/firebase.config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const SelectedMedia = () => {
  const [heroBackground, setHeroBackground] = useState('');
  const [, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const mediaTypeRef = useRef(null);

  const { currentId, setOpenTrailer, setTrailerKey, mediaTypeOfSelected,setMediaTypeOfSelected, currentMediaType, cast, setCast, userLogged, addedToFavs, setAddedToFavs, firebaseActiveUser } = useContext(Context);

  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [vote, setVote] = useState(0);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLogged) {
      //verifica si el documento mediaIDS con el valor uid de usuario existe
      const document = doc(database, 'mediaIDS', firebaseActiveUser.uid);

      getDoc(document)
        .then((snapshot) => {
          if (!snapshot.exists()) return;

          const dataSaved = snapshot.data();
          const savedIds = [...Object.values(dataSaved.mediaID || {})];

          const idAlreadySaved = savedIds.find((el) => el.id == currentId);

          idAlreadySaved ? setAddedToFavs(true) : setAddedToFavs(false);
        })
        .catch((err) => {
          console.error('Hubo un error al verificar el documento2:', err);
        });
    }
  }, []);

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
  }, []);

  function handleBackClick() {
    window.scrollTo(0, 0);
    const fullPath = window.location.pathname;
    const lastPath = fullPath.lastIndexOf('/');
    navigate(fullPath.substring(0, lastPath));
  }

  return (
    <div className='selected-media-container'>
      <i className='bi bi-arrow-left' onClick={handleBackClick}></i>

      <div className='media-hero' style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className='overlay'></div>
      </div>

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
              {userLogged && (
                <i
                  data-id={currentId}
                  ref={mediaTypeRef}
                  data-mediatype={currentMediaType == 'movies' ? 'movie' : 'tv'}
                  id='favs-icon'
                  className={addedToFavs ? 'bi bi-bookmark-check-fill' : 'bi bi-bookmark-plus-fill'}
                  onClick={() => {
                    //verifica si el documento mediaIDS con el valor uid de usuario existe para guardar mas ids dentro de ese documento, de otramanera guardarlos somewhere else
                    const document = doc(database, 'mediaIDS', firebaseActiveUser.uid);

                    getDoc(document)
                      .then((snapshot) => {
                        if (snapshot.exists()) {
                          //guardamos dentro del mismo documento
                          console.log('El documento existe');
                          const dataSaved = snapshot.data();
                          const idAlreadySaved = [...Object.values(dataSaved.mediaID || {})].find((el) => el.id == currentId);

                          if (!idAlreadySaved) {
                            const newData = [...Object.values(dataSaved.mediaID || {}), { id: currentId, mediatype: mediaTypeRef.current.dataset.mediatype, title: title, poster_path: poster }];

                            updateDoc(document, { mediaID: newData })
                              .then(() => {
                                setAddedToFavs(true);
                                console.log('el documento', document, 'se acutalizo con exito');
                              })
                              .catch((err) => console.log('algo paso y el dc no se actualizo', err));
                          } else {
                            const newData = [...Object.values(dataSaved.mediaID).filter((el) => el.id != idAlreadySaved.id)];
                            updateDoc(document, { mediaID: newData })
                              .then(() => {
                                setAddedToFavs(false);
                                console.log('el documento', document, 'se acutalizo con exito');
                              })
                              .catch((err) => console.log('algo paso y el dc no se actualizo', err));

                            console.log('el elemento', idAlreadySaved, 'ha clickeado nuevamente, osea que lo eliminamos de lalista');
                          }
                        } else {
                          console.log('El documento no existe');
                          console.log(mediaTypeRef.current.dataset.mediatype);
                          setDoc(doc(database, 'mediaIDS', firebaseActiveUser.uid), { mediaID: [{ id: currentId, mediatype: mediaTypeRef.current.dataset.mediatype, title: title, poster_path: poster }] })
                            .then(() => {
                              setAddedToFavs(true);
                            })
                            .catch((err) => console.log(err));
                        }
                      })
                      .catch((err) => {
                        console.error('Hubo un error al verificar el documento:', err);
                      });
                  }}
                ></i>
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
    </div>
  );
};

export default SelectedMedia;
