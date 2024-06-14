import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { database, usersCollectionName } from '../../firebase/firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';

import { Tabs, TabsList, TabPanel, Tab } from '@mui/base';
import { Snackbar, Alert } from '@mui/material';
import { Panel } from '../../components/Panel';
import { fetchMyData } from '../../firebase/fetchMyData';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const { firebaseActiveUser } = useContext(Context);

  const [savedFavoritesResults, setSavedFavoritesResults] = useState([]);
  const [savedWatchlistResults, setSavedWatchlistResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState({ message: null, severity: null, open: false });
  const navigate = useNavigate()

  useEffect(() => {
    //subscription to db to get real time changes
    const document = doc(database, usersCollectionName, firebaseActiveUser.uid);
    const unsub = onSnapshot(document, (doc) => {
      setSavedFavoritesResults(doc.data.favorites);
      setSavedWatchlistResults(doc.data.watchlist);
    });

    // return 'unsub' on component unmount to avoid too many subscription to db
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    fetchMyData(firebaseActiveUser, 'favorites', setSavedFavoritesResults, setLoading, setMessage).then(() => {
      setLoading(false);
    });
  }, [, savedFavoritesResults]);

  useEffect(() => {
    fetchMyData(firebaseActiveUser, 'watchlist', setSavedWatchlistResults, setLoading, setMessage).then(() => {
      setLoading(false);
    });
  }, [savedWatchlistResults]);

  return (
    <div className='profile'>
      <p>
        Welcome <span id='user-in-profile'>{firebaseActiveUser.email.split('@')[0]}</span>{' '}
      </p>

      {loading ? (
        <CircularProgress color='inherit' size={100} />
      ) : (
        <Tabs className='tabs' value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
         
         <div className='tablist-container'>
         <i
          className='bi bi-arrow-left'
          onClick={() => {
            navigate(-1);
            window.scrollTo(0, 0);
          }}
        ></i>
          <TabsList className='tablist'>
            <Tab className='tab'>Favorites </Tab>
            <Tab className='tab'>Lists</Tab>
            <span
              onClick={() => {
                fetchMyData(firebaseActiveUser, 'watchlist', setSavedWatchlistResults, setLoading, setMessage).then(() => {
                  setLoading(false);
                });
              }}
            >
              <Tab className='tab'>Watchlist</Tab>
            </span>
          </TabsList>
         </div>
          <Panel value={0} panelName={'favorites'} savedElementResults={savedFavoritesResults} setLoading={setLoading} setMessage={setMessage} />
          <TabPanel className='tabpanel' value={1}>
            <p>soon..</p>
          </TabPanel>
          <Panel value={2} panelName={'watchlist'} savedElementResults={savedWatchlistResults} setLoading={setLoading} setMessage={setMessage} />
        </Tabs>
      )}
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
          severity={message.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
