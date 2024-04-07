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
  const [firebaseActiveUser, setFirebaseActiveUser] = useState({ email: null, uid: null });
  const [loadingAllData, setLoadingAllData] = useState(true)

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
    firebaseActiveUser,
    setFirebaseActiveUser,
    loadingAllData,
    setLoadingAllData
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserLogged(true);
        setFirebaseActiveUser({ email: user.email, uid: user.uid });
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
