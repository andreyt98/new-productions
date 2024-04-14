import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { database } from '../../firebase/firebase.config';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import SliderCard from '../../components/SliderCard';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// dialog
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//

const Profile = () => {
  const { firebaseActiveUser, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  const [savedFavoritesResults, setSavedFavoritesResults] = useState([]);
  const [savedWatchlistResults, setSavedWatchlistResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  //error message component
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ message: null, severity: null });

  // dialog
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    //subscription to db to get real time changes
    const document = doc(database, 'users', firebaseActiveUser.uid);
    const unsub = onSnapshot(document, (doc) => {
      setSavedFavoritesResults(doc.data.favorites);
      setSavedWatchlistResults(doc.data.watchlist);
    });

    // return 'unsub' on component unmount to avoid too many subscription to db
    return () => {
      unsub();
    };
  }, []);

  const showMessage = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  //end of error message code

  const handleClickExternalElement = (newTabIndex) => {
    setActiveTab(newTabIndex);
  };

  const fetchData = async (fieldName, setStateFunction) => {
    try {
      const document = doc(database, 'users', firebaseActiveUser.uid);
      const documentResults = await getDoc(document);

      if (!documentResults.exists()) return;

      const dataSaved = documentResults.data();

      if (Object.entries(dataSaved).length > 0) {
        if (dataSaved[fieldName].length > 0) {
          const temp = await Promise.all(
            dataSaved[fieldName].map((el) => {
              return el;
            })
          );
          setStateFunction(temp);
        }
      }
    } catch (err) {
      setLoading(false);
      setMessage("couldn't load data");
      console.log('error aqui', err);
      showMessage();
      return; //to-do: set error message un screen
    }
  };

  useEffect(() => {
    fetchData('favorites', setSavedFavoritesResults).then(() => {
      setLoading(false);
    });
  }, [, savedFavoritesResults]);

  useEffect(() => {
    fetchData('watchlist', setSavedWatchlistResults).then(() => {
      setLoading(false);
    });
  }, [savedWatchlistResults]);

  const deleteFromFireStore = (fieldName, message) => {
    const document = doc(database, 'users', firebaseActiveUser.uid);

    getDoc(document)
      .then((documentResult) => {
        if (!documentResult.exists()) return;

        const dataSaved = documentResult.data();
        const newData = dataSaved[fieldName].filter((el) => !checkedMedia.includes(el.id.toString()));
        setLoading(true);
        setEdit(false);
        setCheckedMedia([]);

        const updateData = {};
        updateData[fieldName] = newData;

        updateDoc(document, updateData).then(() => {
          setLoading(false);
        });
        setMessage({ message: message, severity: 'success' });
        showMessage();
      })
      .catch((err) => {
        setMessage({ message: 'Error deleting data, try again later', severity: 'error' });
        showMessage();
        setLoading(false);
        return; //todo: set error message un screen
      });
  };

  return (
    <div className='profile'>
      <p>
        Welcome <span id='user-in-profile'>{firebaseActiveUser.email.split('@')[0]}</span>{' '}
      </p>

      {loading ? (
        <CircularProgress color='inherit' size={100} />
      ) : (
        <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <TabsList>
            <Tab style={{ border: 'none' }}>Favorites </Tab>
            <Tab style={{ border: 'none' }}>Lists</Tab>
            <span
              onClick={() => {
                fetchData('watchlist', setSavedWatchlistResults).then(() => {
                  setLoading(false);
                });
              }}
            >
              <Tab style={{ border: 'none' }}>Watchlist</Tab>
            </span>
          </TabsList>

          <TabPanel value={0}>
            {savedFavoritesResults && savedFavoritesResults.length > 0 && (
              <span style={{ display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                <p
                  style={{ textAlign: 'right', cursor: 'pointer', marginBottom: '10px' }}
                  onClick={() => {
                    setEdit(!edit);

                    if (edit) {
                      // TODO: use react
                      document.querySelectorAll('.card').forEach((card) => {
                        card.style.border = '3px solid transparent';
                      });
                    }
                    setCheckedMedia([]);
                  }}
                >
                  <i className='bi bi-pencil-square'></i> Edit
                </p>

                {checkedMedia.length > 0 && (
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setOpenDialog(true);
                    }}
                  >
                    <i className='bi bi-trash3'></i> Delete
                  </p>
                )}

                {/* TODO: put this in a reusable component */}
                <Dialog
                  open={openDialog}
                  onClose={() => {
                    setOpenDialog(false);
                  }}
                  aria-labelledby='responsive-dialog-title'
                >
                  <DialogTitle style={{ textShadow: 'none' }} id='responsive-dialog-title'>
                    {'Confirm the action'}
                  </DialogTitle>
                  <DialogContent style={{ textShadow: 'none' }}>
                    <DialogContentText style={{ background: '' }}>Do you really you want to delete this data from favorites?</DialogContentText>
                  </DialogContent>
                  <DialogActions style={{ background: '' }}>
                    <Button
                      style={{ border: '1px solid #00a87e', padding: '3px 7px', color: '#00a87e', borderRadius: '25px' }}
                      className='button'
                      onClick={() => {
                        setOpenDialog(false);
                      }}
                      autoFocus
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ border: '1px solid #00a87e', background: '#00a87e', color: 'white', padding: '3px 7px', borderRadius: '25px' }}
                      className='button'
                      autoFocus
                      onClick={() => {
                        deleteFromFireStore('favorites', 'Favorites updated!');
                        setOpenDialog(false);
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </span>
            )}
            <div className='results'>
              {savedFavoritesResults &&
                savedFavoritesResults.length > 0 &&
                savedFavoritesResults
                  .slice()
                  .reverse()
                  .map((favorite) => {
                    return <SliderCard result={favorite} changeMediaType={favorite.mediatype} key={favorite.id} />;
                  })}
            </div>
          </TabPanel>
          <TabPanel value={1}>
            <p>soon..</p>
          </TabPanel>
          <TabPanel value={2}>
            {savedWatchlistResults && savedWatchlistResults.length > 0 && (
              <span style={{ display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                <p
                  style={{ textAlign: 'right', cursor: 'pointer', marginBottom: '10px' }}
                  onClick={() => {
                    setEdit(!edit);

                    if (edit) {
                      // TODO: use react
                      document.querySelectorAll('.card').forEach((card) => {
                        card.style.border = '3px solid transparent';
                      });
                    }
                    setCheckedMedia([]);
                  }}
                >
                  <i className='bi bi-pencil-square'></i> Edit
                </p>

                {checkedMedia.length > 0 && (
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setOpenDialog(true);

                    }}
                  >
                    <i className='bi bi-trash3'></i> Delete
                  </p>
                )}
                <Dialog
                  open={openDialog}
                  onClose={() => {
                    setOpenDialog(false);
                  }}
                  aria-labelledby='responsive-dialog-title'
                >
                  <DialogTitle style={{ textShadow: 'none' }} id='responsive-dialog-title'>
                    {'Confirm the action'}
                  </DialogTitle>
                  <DialogContent style={{ textShadow: 'none' }}>
                    <DialogContentText style={{ background: '' }}>Do you really you want to delete this data from watchlist?</DialogContentText>
                  </DialogContent>
                  <DialogActions style={{ background: '' }}>
                    <Button
                      style={{ border: '1px solid #00a87e', padding: '3px 7px', color: '#00a87e', borderRadius: '25px' }}
                      className='button'
                      onClick={() => {
                        setOpenDialog(false);
                      }}
                      autoFocus
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ border: '1px solid #00a87e', background: '#00a87e', color: 'white', padding: '3px 7px', borderRadius: '25px' }}
                      className='button'
                      autoFocus
                      onClick={() => {
                        deleteFromFireStore('watchlist', 'Watchlist updated!');
                        setOpenDialog(false);
                        handleClickExternalElement(2);
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </span>
            )}

            <div className='results'>
              {savedWatchlistResults &&
                savedWatchlistResults.length > 0 &&
                savedWatchlistResults
                  .slice()
                  .reverse()
                  .map((el) => {
                    return <SliderCard result={el} changeMediaType={el.mediatype} key={el.id} />;
                  })}
            </div>
          </TabPanel>
        </Tabs>
      )}
      <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.severity} variant='filled' sx={{ width: '100%' }}>
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;

// base of tab
const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  
  `
);

//tab buttons
const Tab = styled(BaseTab)`
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: rgba(18, 18, 18, 0.8980392157);
  width: 100%;
  padding: 7px 15px;
  margin: 1px;
  display: flex;
  justify-content: center;
  transition: all 0.5s;

  &.${tabClasses.selected} {
    background-color: #00a87e;
    color: #fff;

    &:hover {
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
  margin-top:5px;
  `
);
