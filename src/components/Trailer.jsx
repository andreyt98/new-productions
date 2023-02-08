import { useState } from 'react';
import PortalReactDom from 'react-dom';
import ReactPlayer from 'react-player';

const Trailer = ({ openTrailer, setOpenTrailer, trailerKey }) => {
  if (!openTrailer) return null;

  const [minBtn, setMinBtn] = useState(false);
  const [minBtnClass, setMinBtnClass] = useState('bi bi-fullscreen-exit');

  function handleMin() {
    setMinBtn(!minBtn);

    minBtn ? setMinBtnClass('bi bi-fullscreen-exit') : setMinBtnClass('bi bi-fullscreen');
  }

  return PortalReactDom.createPortal(
    <div className={minBtn ? 'min' : 'trailer'} style={{backgroundColor: trailerKey === null && 'black'}}>
      <button
        className='trailer-btn close-btn'
        onClick={() => {
          setOpenTrailer(false);
        }}
      >
        <i className='bi bi-x-lg'></i>
      </button>

      {trailerKey &&
      <button
        className='trailer-btn min-btn'
        onClick={() => {
          handleMin();
        }}
      >
        {' '}
        <i className={minBtnClass}></i>
      </button>
      }

      {trailerKey === null ? <h2 style={{position: "absolute", top: "50%", left: "50%", transform: "translateX(-50%)" }}>No trailer :/</h2> :
       <ReactPlayer url={`https://www.youtube.com/watch?v=${trailerKey}`} width='100%' height='100%' controls playing />}
    </div>,
    document.querySelector('.portal')
  );
};

export default Trailer;
