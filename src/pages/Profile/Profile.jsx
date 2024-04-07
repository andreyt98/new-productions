import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { database } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import SliderCard from '../../components/SliderCard';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const { firebaseActiveUser } = useContext(Context);

  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const document = doc(database, 'mediaIDS', firebaseActiveUser.uid);
        const snapshot = await getDoc(document);

        if (!snapshot.exists()) return;

        const dataSaved = snapshot.data();

        if (dataSaved.mediaID.length > 0) {
          const temp = await Promise.all(
            dataSaved.mediaID.map((el) => {
              return el;
            })
          );
          setSavedResults(temp);
        }
      } catch (err) {
        setLoading(false);
        return; //to-do: set error message un screen
      }
    };

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className='profile'>
      <p>
        Welcome <span id='user-in-profile'>{firebaseActiveUser.email.split('@')[0]}</span>{' '}
      </p>

      {loading ? 
          <CircularProgress color="inherit" size= {100} />
        :
         <div className='results'>
            { savedResults.length > 0 && 
              savedResults.map((el) => {
                return <SliderCard result={el} changeMediaType={el.mediatype} key={el.id} />;
              })
            }
          </div>
      }
 
    </div>
  );
};

export default Profile;
