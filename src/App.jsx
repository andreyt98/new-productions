import { useEffect, useState } from 'react';
import { Context } from './context/Context';
import AppRouter from './router/AppRouter';
import { auth } from './firebase/firebase.config';

function App() {
  const [currentId, setCurrentId] = useState();
  const [openTrailer, setOpenTrailer] = useState('');
  const [trailerKey, setTrailerKey] = useState('');
  const [cast, setCast] = useState('');
  const [currentMediaType, setCurrentMediaType] = useState(window.location.pathname.slice(1));
  const [apiData, setApiData] = useState([]);
  const [userClicked, setUserClicked] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [noAccount, setNoAccount] = useState(true);
  const [addedToFavs, setAddedToFavs] = useState(false);
  const [addedtoWatchList, setAddedtoWatchList] = useState(false);
  const [firebaseActiveUser, setFirebaseActiveUser] = useState({ email: null, uid: null });
  const [loadingAllData, setLoadingAllData] = useState(true);
  const [edit, setEdit] = useState(false);
  const [checkedMedia, setCheckedMedia] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [isMember, setIsMember] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const contextValues = {
    currentId,
    setCurrentId,
    openTrailer,
    setOpenTrailer,
    trailerKey,
    setTrailerKey,
    currentMediaType,
    setCurrentMediaType,
    apiData,
    setApiData,
    cast,
    setCast,
    userClicked,
    setUserClicked,
    userLogged,
    setUserLogged,
    noAccount,
    setNoAccount,
    addedToFavs,
    setAddedToFavs,
    addedtoWatchList,
    setAddedtoWatchList,
    firebaseActiveUser,
    setFirebaseActiveUser,
    loadingAllData,
    setLoadingAllData,
    edit,
    setEdit,
    checkedMedia,
    setCheckedMedia,
    searchResults,
    setSearchResults,
    isMember,
    openDialog,
    setOpenDialog,
  };

  useEffect(() =>{

    if(currentMediaType.includes("movies")){
      setCurrentMediaType("movies")
    }else if(currentMediaType.includes("tvshows")){
      setCurrentMediaType("tvshows")
    }

  },[currentMediaType])

  useEffect(() => {

    auth.onAuthStateChanged((user) => {

      if (user) {
        setUserLogged(true);
        setFirebaseActiveUser({ email: user.email, uid: user.uid });

        setIsMember(true);
        setOpenDialog(false);
      } else {
        setTimeout(() => {
          if (!user && !localStorage.getItem('auth')) {
            setIsMember(false);
            setOpenDialog(true);
          }
        }, 4000);
      }
    });
  }, []);

  return (
    <Context.Provider value={contextValues}>
      <div className='App'>
        <AppRouter />
      </div>
    </Context.Provider>
  );
}

export default App;
