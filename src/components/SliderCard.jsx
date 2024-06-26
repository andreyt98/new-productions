import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { imageWithSize } from '../helpers/api.config';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';

const SliderCard = ({ result, changeMediaType = null, canBeEdited = false }) => {
  const [poster, setPoster] = useState(null);
  const { setCurrentId, setCurrentMediaType, currentMediaType, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  const [checked, setChecked] = useState(true);
  const l = `/${changeMediaType === 'movie' ? 'movies' : 'tvshows'}`;
  const handleChange = (event) => {
    setChecked(event.target.checked);

    const card = event.target.parentElement.parentElement.parentElement;

    if (event.target.checked) {
      card.style.border = '3px solid #0080ff';
    } else {
      card.style.border = '3px solid transparent';
    }

    if (event.target.checked) {
      if (!checkedMedia.includes(event.target.id)) {
        setCheckedMedia([...checkedMedia, event.target.id]);
      }
    } else {
      if (checkedMedia.includes(event.target.id)) {
        setCheckedMedia(checkedMedia.filter((element) => element !== event.target.id));
      }
    }
  };

  useEffect(() => {
    return () => {
      setEdit(false);
    };
  }, []);
  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${imageWithSize('780')}${result.poster_path}`);
    }
  }, [result]);
  return (
    poster && (
      <div className='card' data-id={result.id}>
        <span className='vote'>{result.vote_average.toString().slice(0, 3)}</span>
        {changeMediaType ? <span className='mediatype'>{result.mediatype || result.media_type}</span> : null}
        <Link
          to={changeMediaType != null ? `${l}/${result.id}` : `${result.id}`}
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
        {canBeEdited && edit && (
          <span id='checkbox'>
            <Checkbox
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
              id={result.id.toString()}
              sx={{
                '&:hover': { bgcolor: 'black' },
                bgcolor: '#0008',
                color: 'white',
                '&.Mui-checked': {
                  bgcolor: '#000',
                },
              }}
            />
          </span>
        )}
      </div>
    )
  );
};

export default SliderCard;
