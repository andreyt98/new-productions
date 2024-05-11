import Hero from '../../components/Hero';
import Slider from '../../components/Slider';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { Context } from '../../context/Context';

const TvSection = () => {
  const { loadingAllData } = useContext(Context);

  return loadingAllData ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color='inherit' size={100} style={{ marginTop: '100px' }} />
    </div>
  ) : (
    <section>
      <Hero />
      <Slider />
    </section>
  );
};

export default TvSection;
