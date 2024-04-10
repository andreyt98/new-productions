import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { image } from '../helpers/api.config';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';




const SliderCard = ({ result, changeMediaType = null }) => {
  const [poster, setPoster] = useState(null);
  const { setCurrentId, setCurrentMediaType,edit, checkedMedia, setCheckedMedia } = useContext(Context);

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);

    if(event.target.checked){
      if(!checkedMedia.includes(event.target.id)){     
        setCheckedMedia( [...checkedMedia,event.target.id])
      }
    }else{
      if(checkedMedia.includes(event.target.id)){
        setCheckedMedia( checkedMedia.filter((element) =>  element !== event.target.id))
      }
    }
  };


  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${image({ size: 500 })}${result.poster_path}`);
    }
  }, []);
  return (
    poster && (
      <div className='card' data-id={result.id}>
        <Link
          to={`${result.name || result.title}`}
          onClick={() => {
            setCurrentId(result.id);
            if (changeMediaType) {
              setCurrentMediaType(changeMediaType == 'movie' ? 'movies' : 'tvshows');
            }
          }}
          >
          <div className='content' key={result.id}>
            <img src={poster} alt='' />
          </div>
        </Link>
        {edit &&
        
        <span>
          <Checkbox
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
            id={result.id.toString()}
            sx={{
              '&:hover': { bgcolor: 'black' },
              bgcolor:'#0008',
              color:'white',
              '&.Mui-checked': {
                bgcolor:'#000'
              }
            }}
          />
        </span>
        }
      </div>
    )
  );
};

export default SliderCard;
