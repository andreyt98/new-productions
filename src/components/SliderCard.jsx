import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { image } from '../helpers/api.config';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';

const SliderCard = ({ result }) => {
  const [poster, setPoster] = useState(null);
  const {  setCurrentId } = useContext(Context);

  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${image({ size: 500 })}${result.poster_path}`);
    }
  }, []);
  return (
    poster &&
      <Link
        to={`${result.name || result.title}`}
        onClick={() => {
          setCurrentId(result.id);
        }}
      >
        <div className='content' key={result.id}>
          <img src={poster} alt='' />
        </div>
      </Link>
    
  );
};

export default SliderCard;
