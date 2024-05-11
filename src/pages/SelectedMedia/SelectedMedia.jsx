import { useState, useEffect, useContext, useRef } from 'react';
import { image } from '../../helpers/api.config';
import { handleTrailerClick } from '../../helpers/getTrailer';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import { getById } from '../../helpers/getById';
import { getCast } from '../../helpers/getCast';
import { database } from '../../firebase/firebase.config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



const SelectedMedia = () => {
  const [heroBackground, setHeroBackground] = useState('');
  const [, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const { currentId, setOpenTrailer, setTrailerKey, currentMediaType, cast, setCast, userLogged, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } = useContext(Context);

  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [vote, setVote] = useState(0);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const [loadingAllData, setLoadingAllData] = useState(true);
  const [loadingCast, setLoadingCast] = useState(true);


  //error message component
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(false);
  };
 // end of error message code

  const getFromFirestore = ( documentName,fieldName, callbackToUpdateUIComponent, callbackToStopLoader )=>{
    const document = doc(database, 'users', documentName);

    getDoc(document)
    .then((documentResult) => {
      if (!documentResult.exists()) {callbackToStopLoader(false); return};

        const allFieldsFromDocument = documentResult.data();
        const savedIds = [...Object.values(allFieldsFromDocument[fieldName] || {})];

        const idAlreadySaved = savedIds.find((el) => el.id == currentId);

        idAlreadySaved ? callbackToUpdateUIComponent(true): callbackToUpdateUIComponent(false);
        callbackToStopLoader(false)
      })
      .catch((err) => {
        return; //todo: set error message un screen
      });
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    const mediaType = currentMediaType == 'movies' ? 'movie' : 'tv';

    getById(mediaType, currentId)
    .then((data) => {
      const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data;
      setResults({ title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path });

      setTitle(title || original_name);
      setOverview(overview);
      setReleaseDate(release_date?.slice(0, 4) || first_air_date?.slice(0, 4));
      setGenres(genres.map((genre) => genre.name));
      setVote(String(vote_average).slice(0, 3));

      let initialBackground = window.innerWidth >= 640 ? `${image({ size: 1280 })}${backdrop_path}` : `${image({ size: 500 })}${poster_path}`;
      setHeroBackground(initialBackground);

      let post = `${image({ size: 500 })}${poster_path}`;
      setPoster(post);
      setLoadingAllData(false)

      getCast(mediaType, currentId)
      .then((data) => {
        setCast(data);
        setLoadingCast(false);
      }).catch(()=>{
        throw new Error();
      })

    }).catch(()=>{ setLoadingCast(false)}) //todo: display error in screen 

    if (userLogged) {
      getFromFirestore(firebaseActiveUser.uid,'favorites', setAddedToFavs, setLoadingFavs);
      getFromFirestore(firebaseActiveUser.uid,'watchlist', setAddedtoWatchList, setLoadingWatchlist);
    }
  }, []);


  const handleSaveOrDelete = (documentName, referenceOfClickedElement,title,poster,vote,fieldName, callbackToUpdateUIComponent) =>{
    //reference of document 'documentName' from 'users' colection 
    const document = doc(database, 'users', documentName);
    
    getDoc(document)
    .then((documentResult) => {
      if (documentResult.exists()) {
        const dataSaved = documentResult.data();
          const idAlreadySaved = [...Object.values(dataSaved[fieldName] || {})].find((el) => el.id == currentId);
          
          if (!idAlreadySaved) {
            const newData = [...Object.values(dataSaved[fieldName] || {}), { id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: title,vote_average:vote, poster_path: poster }];

            const updateData = {};
            updateData[fieldName] = newData;
            updateDoc(document, updateData)
            callbackToUpdateUIComponent(true); 

          } else {
            const newData = [...Object.values(dataSaved[fieldName]).filter((el) => el.id != idAlreadySaved.id)];
            const updateData = {};
            updateData[fieldName] = newData;
            updateDoc(document, updateData)
            
            callbackToUpdateUIComponent(false); //to-do: set data saved correctly message un screen
          }
        } else {
          const updateData = {};
          updateData[fieldName] =[{ id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: title,vote_average:vote, poster_path: poster }] 
          setDoc(doc(database, 'users', documentName),updateData )
          callbackToUpdateUIComponent(true);
        }
      })
      .catch((err) => {
        setErrorMessage("Error saving to favorites, try again later!")
        setShowError(true);
        return; //todo: set error message un screen
      });
  } 


  function handleBackClick() {
    window.scrollTo(0, 0);
    const fullPath = window.location.pathname;
    const lastPath = fullPath.lastIndexOf('/');
    navigate(fullPath.substring(0, lastPath));
  }

  return (

    loadingAllData ? 
      <div style={{display:'flex', justifyContent: 'center'}} >
          <CircularProgress color="inherit"  size= {100} style={{marginTop: '100px' }}/>
      </div>
    :
      <div className='selected-media-container'>
          <i className='bi bi-arrow-left' onClick={handleBackClick}></i>

          <div className='media-hero' style={{ backgroundImage: `url(${heroBackground})`, opacity:'0.6' }}>
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
                    <>
                      {loadingFavs ? (
                        <CircularProgress color="inherit"  size= {10}  />
                      ) : (                  
                        <Tooltip title={addedToFavs ? "Delete from favorites" : "Add to favorites"} placement="top">
                          <i
                            data-id={currentId}
                            ref={mediaTypeRef}
                            data-mediatype={currentMediaType == 'movies' ? 'movie' : 'tv'}
                            id='favs-icon'
                            className={addedToFavs ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'}
                            style={{fontSize:'200%',}}
                            onClick={() => {
                              handleSaveOrDelete(firebaseActiveUser.uid,mediaTypeRef,title,poster,vote,'favorites',setAddedToFavs);
                            }}
                          ></i>
                        </Tooltip>
                      )}

                      {loadingWatchlist ? (
                        <CircularProgress color="inherit"  size= {10}  />
                      ) : (
                        <Tooltip title={addedtoWatchList ? "Delete from watchlist" : "Add to watchlist"} placement="top">
                        <i
                          data-id={currentId}
                          ref={mediaTypeRef2}
                          data-mediatype={currentMediaType == 'movies' ? 'movie' : 'tv'}
                          id='watchlist-icon'
                          className={addedtoWatchList ? 'bi bi-eye-fill' : 'bi bi-eye'}
                          onClick={() => {
                            handleSaveOrDelete(firebaseActiveUser.uid,mediaTypeRef2,title,poster,vote,'watchlist',setAddedtoWatchList);
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

            <Tabs defaultValue={0} style={{marginTop: '50px',width:'100%', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
              <TabsList>
                <Tab value={0} style={{border:'none'}}>Cast </Tab>
                <Tab value={1} style={{border:'none'}}>Reviews</Tab>
                <Tab value={2} style={{border:'none'}}>Similar</Tab>
              </TabsList>
 
              <TabPanel value={0}>
                {loadingCast ?
                  <CircularProgress color="inherit"  size= {40}  />
                  :
                  cast &&
                  <section className='selected-media-cast'>
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
                        })    }              
                    </div>                        
                  </section>
                }
              </TabPanel>
              <TabPanel value={1}>
              <p>soon..</p>
              </TabPanel>
              <TabPanel value={2}>
              <p>soon..</p>
              </TabPanel>
            </Tabs>

          </div>     

        <Snackbar open={showError} autoHideDuration={3500} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
      </Snackbar>
      </div>

  );
};

export default SelectedMedia;

// base of tab
const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  `,
);

//tab buttons
const Tab = styled(BaseTab)`
  color: #fff;
  cursor: pointer;
  font-size: .9rem;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 1px;
  display: flex;
  justify-content: center;
  transition: all 0.5s;

  &.${tabClasses.selected} {
    background-color: #00a87e;
    color: #fff;

    &:hover{
      background-color: #00a87e;
      color: #fff;
    }
  }
`;

//tab content
const TabPanel = styled(BaseTabPanel)(
  ({ theme }) => `
  width: 90%;
  font-size: 0.875rem;
  padding: 20px 12px;
  `,
);