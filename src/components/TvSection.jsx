import Hero from './Hero';
import Slider from './Slider';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { Context } from '../context/Context';

const TvSection = () => {
  const {loadingAllData} = useContext(Context)

  return (
    loadingAllData?
      <div style={{display:'flex', justifyContent: 'center'}} >
        <CircularProgress color="inherit"  size= {100} style={{marginTop: '100px' }}/>
      </div>
    :
      <section className='tv-section'>
        <Hero />
        <Slider />
      </section>
  );
};

export default TvSection;
