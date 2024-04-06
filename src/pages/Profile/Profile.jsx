import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { database } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import SliderCard from '../../components/SliderCard';

const Profile = () => {
  const { firebaseActiveUser } = useContext(Context);

  const [savedResults, setSavedResults] = useState([]);

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
        return; //to-do: set error message un screen
      }
    };

    fetchData();
  }, []);

  return (
    <div className='profile'>
      <p>
        Welcome <span id='user-in-profile'>{firebaseActiveUser.email}</span>{' '}
      </p>

      {savedResults.length > 0 ? (
        savedResults.map((el) => {
          return <SliderCard result={el} changeMediaType={el.mediatype} key={el.id}/>;
        })
      ) : (
        <p>save something!</p>
      )}
    </div>
  );
};

export default Profile;
