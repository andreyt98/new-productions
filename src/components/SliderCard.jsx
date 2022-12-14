import { useEffect } from 'react';
import { useState } from 'react';
import { image } from '../helpers/api.config';
import { getProvider } from '../helpers/getProviders';
import { getTrailer } from '../helpers/getTrailer';

const SliderCard = ({ results, result, mediaType, setOpenTrailer, setTrailerKey }) => {
  const [provider, setProvider] = useState('');
  const [saveStyle, setSaveStyle] = useState(false);
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${image({ size: 500 })}${result.poster_path}`);
    }
  }, []);

  function changeProvider(id) {
    results.forEach((result) => {
      if (result.id === id) {
        getProvider(result.id, mediaType).then((providerData) => {
          const { results: providerResults } = providerData;
          const noProvider = Object.keys(providerData.results).length < 1;
          if (noProvider) {
            setProvider('');
            return;
          }

          if (providerResults) {
            Object.values(providerResults).map((result) => {
              if (providerResults.US != undefined) {
                Object.values(providerResults.US)[1].map((AnyResult, index) => {
                  if (index === 0) {
                    setProvider(AnyResult.provider_name);
                  }
                });
              } else {
                Object.values(result)[1].map((fromAnyLanguage) => {
                  setProvider(Object.values(fromAnyLanguage)[2]);
                });
              }
            });
          }
        });
      }
    });
  }

  function handleTrailerClick(id) {
    setOpenTrailer(true);
    getTrailer(id, mediaType).then((data) => {
      if(data.results.length<1){
        setTrailerKey(null)
      }else{
        data.results.forEach((element) => {
          if (element.type === 'Trailer') {
            setTrailerKey(element.key);
          }
        });
      }
    });
  }

  function changeSaveStyle() {
    setSaveStyle(!saveStyle);
  }

  return (
    poster && 
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
