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

        if (snapshot.exists()) {
          const dataSaved = snapshot.data();
          if (dataSaved.mediaID.length > 0) {
            const temp = await Promise.all(
              dataSaved.mediaID.map((el) => {
                return el;
              })
            );
            setSavedResults(temp);
          }
        } else {
          console.log('El documento no existe');
        }
      } catch (err) {
        console.error('Hubo un error al verificar el documento:', err);
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
          return <SliderCard result={el} changeMediaType={el.mediatype} />;
        })
      ) : (
        <p>save something!</p>
      )}
    </div>
  );
};

export default Profile;
