import { useContext, useEffect } from 'react';
import { Context } from '../context/Context';
import { fetchData } from '../helpers/fetchData';

const category= ['trending', 'popular']
const limit= [4, 7]

export const mediaProperties = {

  movie: {
    mediaType: 'movie',
    category,
    limit
  },
  tv: {
    mediaType: 'tv',
    category,
    limit
  },
};

const MediaData = () => {
  const { currentMediaType,setCurrentMediaType, setApiData } = useContext(Context);

  useEffect(() => {

    if (currentMediaType !== 'movies' && currentMediaType !== 'tvshows') {
        setCurrentMediaType('movies');
      }
    async function callFetch() {
        try {
            const movieData = await fetchData(mediaProperties.movie);
            const tvData = await fetchData(mediaProperties.tv);
            if(movieData && tvData){
                const tempApiData = [];
                tempApiData.push(movieData, tvData);
                return tempApiData;
            }else{
                throw new Error
            }
        } catch (e) {
            console.log( e);
        }
    }

    callFetch().then((data) => {
        setApiData(data);
    });

  }, []);

  return ;
  
};

export default MediaData;
