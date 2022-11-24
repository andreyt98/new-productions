import { useState } from 'react';
import { image } from '../helpers/api.config';
import { getProvider } from '../helpers/getProviders';
import { getTrailer } from '../helpers/getTrailer';

const SliderCard = ({ results,result, mediaType,setOpenTrailer ,setTrailerKey }) => {
  const [provider, setProvider] = useState('');
  const [saveStyle, setSaveStyle] = useState(false);

  function changeProvider(id) {
    results.forEach((result) => {
      if (result.id === id) {

        getProvider(result.id, mediaType).then((element) => {
          if (Object.keys(element.results).length < 1) {
            setProvider('');
            return;
          }

          if (mediaType === 'movie') {
            if (element.results.US) {
              setProvider(element.results.US.flatrate[0].provider_name);
            } else {
              if (Object.values(element.results)[0].flatrate) {
                setProvider(Object.values(element.results)[0].flatrate[0].provider_name);
              } else {
                setProvider(Object.values(element.results)[0].buy[0].provider_name);
              }
            }
          } else {
            if (element.results.US) {
              setProvider(element.results.US.flatrate[0].provider_name);
            } else {
              setProvider(Object.values(element.results)[0].flatrate[0].provider_name);
            }
          }
        });
      }
    });
  }

  function handleTrailerClick(id) {
    getTrailer(id, mediaType).then((data) => {
      data.results.forEach((element) => {
        if (element.type === 'Trailer') {
           setTrailerKey(element.key);
          setOpenTrailer(true);
          console.log(mediaType)
        }
      });
    });
  }

  function changeSaveStyle(){
    setSaveStyle(!saveStyle);
  }

  return (
    <div className='content' key={result.id}>
      <div
        className='overlay'
        onMouseEnter={() => {
           changeProvider(result.id);
        }}
        onMouseLeave={() => {
           setProvider('');
        }}
      >
        <p className='provider'>{provider}</p>
        <i
          className='bi bi-play-circle-fill'
          data-id={result.id}
          onClick={() => {
            handleTrailerClick(result.id);
          }}
        ></i>{' '}
        <a href='#' className='more'>
          more {''}
          <i className='bi bi-arrow-right-circle-fill'></i>
        </a>
        <i className={saveStyle? 'bi bi-bookmark-check-fill save-btn' : "bi bi-bookmark-plus-fill save-btn"}
         style={{color: `${saveStyle? '#00c190': ""}`}} onClick={()=>{changeSaveStyle()}}></i>
      </div>
      <img src={`${image({ size: 500 })}${result.poster_path}`} alt='' />
    </div>
  );
};

export default SliderCard;