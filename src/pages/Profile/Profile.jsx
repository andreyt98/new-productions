import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { database } from '../../firebase/firebase.config';
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import SliderCard from '../../components/SliderCard';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';




const Profile = () => {
  const { firebaseActiveUser,editFavorites, setEditFavorites,checkedMedia,setCheckedMedia } = useContext(Context);

  const [savedFavoritesResults, setSavedFavoritesResults] = useState([]);
  const [savedWatchlistResults, setSetsavedWatchlistResults] = useState([])
  const [loading, setLoading] = useState(true);

  const fetchData = async (documentName, setStateFunction) => {
    try {
      const document = doc(database, documentName, firebaseActiveUser.uid);
      const snapshot = await getDoc(document);

      if (!snapshot.exists()) return;

      const dataSaved = snapshot.data();

      if (dataSaved.mediaID.length > 0) {
        const temp = await Promise.all(
          dataSaved.mediaID.map((el) => {
            return el;
          })
        );
        setStateFunction(temp);
      }
    } catch (err) {
      setLoading(false);
      return; //to-do: set error message un screen
    }
  };

  useEffect(() => {    
    fetchData('mediaIDS',setSavedFavoritesResults)
    .then(() => {
      setLoading(false);
    });
  }, [,savedFavoritesResults]);

  return (
    <div className='profile'>
      <p>
        Welcome <span id='user-in-profile'>{firebaseActiveUser.email.split('@')[0]}</span>{' '}
      </p>

      {loading ? 
          <CircularProgress color="inherit" size= {100} />
        :

        <Tabs defaultValue={0} style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
              <TabsList>
                <Tab value={0} style={{border:'none'}}>Favorites </Tab>
                <Tab value={1} style={{border:'none'}}>Lists</Tab>
                <span  onClick={()=>{
                    fetchData('watchlistIDS',setSetsavedWatchlistResults)
                    .then(() => {
                      setLoading(false);
                    });
                  }}>
                  <Tab value={2} style={{border:'none'}}>Watchlist</Tab>
                </span>
              </TabsList>
 
              <TabPanel value={0}>
                {savedFavoritesResults.length > 0 && 
                <span style={{display:'flex', justifyContent:'right',gap:'1rem'}}>

                 <p style={{textAlign:'right', cursor:'pointer', marginBottom:'10px'}} onClick={()=>{setEditFavorites(!editFavorites), setCheckedMedia([])}} ><i className="bi bi-pencil-square"></i> Edit</p> 
                 {checkedMedia.length>0 &&
                   <p style={{cursor:'pointer'}}
                    onClick={()=>{
                      const document = doc(database, 'mediaIDS', firebaseActiveUser.uid);

                      getDoc(document)
                        .then((snapshot) => {
                          if (snapshot.exists()) {
                              const dataSaved = snapshot.data();
                              const newData = dataSaved.mediaID.filter(el => !checkedMedia.includes(el.id.toString()))
                              setLoading(true);
                              setEditFavorites(false);
                              setCheckedMedia([]);
                              updateDoc(document, { mediaID: newData })
                              .then(() => {                               
                                setSavedFavoritesResults(newData);
                              })
                              .catch((err) => {
                                setLoading(false);
                                return;
                              }); //to-do: set error message un screen
                            } else {
                               return;
                            }
                          })
                        .catch((err) => {
                          setLoading(false);
                          return; //to-do: set error message un screen
                        });
                    }}
                   ><i class="bi bi-trash3"></i> Delete</p>
                 }
                </span>
                
                }
                <div className='results'>
                  { savedFavoritesResults.length > 0 && 
                  
                    savedFavoritesResults.slice().reverse().map((favorite) => {
                      return <SliderCard result={favorite} changeMediaType={favorite.mediatype} key={favorite.id} />;
                    })
                  }
                </div>
              </TabPanel>
              <TabPanel value={1}>
              <p>soon..</p>
              </TabPanel>
              <TabPanel value={2}>
              <div className='results'>
                { savedWatchlistResults.length > 0 && 
                  savedWatchlistResults.slice().reverse().map((el) => {
                    return <SliderCard result={el} changeMediaType={el.mediatype} key={el.id} />;
                  })
                }
              </div>
              </TabPanel>
            </Tabs>
        
      }
 
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
  
  `,
);

//tab buttons
const Tab = styled(BaseTab)`
  color: #fff;
  cursor: pointer;
  font-size: .9rem;
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
  margin-top:5px;
  `,
);