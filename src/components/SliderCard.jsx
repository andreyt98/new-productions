import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { image } from '../helpers/api.config';
import { assignProvider } from '../helpers/getProviders';
import { handleTrailerClick } from '../helpers/getTrailer';
import {Context} from '../context/Context'

const SliderCard = ({ result, setOpenTrailer, setTrailerKey }) => {
  const [provider, setProvider] = useState('');
  const [saveStyle, setSaveStyle] = useState(false);
  const [poster, setPoster] = useState(null);
  const {currentMediaType} = useContext(Context)

  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${image({ size: 500 })}${result.poster_path}`);
    }
  }, []);

  function changeSaveStyle() {
    setSaveStyle(!saveStyle);
  }

  return (
    poster && 
    <div className='content' key={result.id}>
      <div
        className='overlay'
        onMouseEnter={() => {
          assignProvider(result.id,currentMediaType,setProvider)
        }}
      >
        <p className='provider'>{provider}</p>
        <i
          className='bi bi-play-circle-fill'
          data-id={result.id}
          onClick={() => {
            handleTrailerClick(setOpenTrailer,result.id,currentMediaType,setTrailerKey);

          }}
        ></i>{' '}
        <a href='#' className='more'>
          more {''}
          <i className='bi bi-arrow-right-circle-fill'></i>
        </a>
        <i
          className={saveStyle ? 'bi bi-bookmark-check-fill save-btn' : 'bi bi-bookmark-plus-fill save-btn'}
          style={{ color: `${saveStyle ? '#00c190' : ''}` }}
          onClick={() => {
            changeSaveStyle();
          }}
        ></i>
      </div>
      <img src={poster} alt='' />
    </div>
  );
};

export default SliderCard;
