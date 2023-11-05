import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MovieSection from '../components/MovieSection';

import Navbar from '../components/Navbar';
import SearchSection from '../pages/SearchSection/index';
import TvSection from '../components/tvSection';
import Info from '../components/Info';
import Trailer from '../components/Trailer';
import MediaData from '../components/MediaData'
import { useContext } from 'react';
import { Context } from '../context/Context';
const AppRouter = () => {
  const { openTrailer, setOpenTrailer, trailerKey } = useContext(Context);
  return (
    <BrowserRouter>
      <Navbar />
      <MediaData/>

      <Routes>
        <Route path='/movies' element={<MovieSection />}></Route>
         <Route path='/tvshows' element={<TvSection />}></Route> 
        <Route path='/search' element={<SearchSection />}></Route>

        <Route path='/movies/:id' element={<Info mediaType={'movie'} />}></Route>
        <Route path='/tvshows/:id' element={<Info mediaType={'tv'} />}></Route>

        <Route path='*' element={<Navigate to='/movies' />} /> 
      </Routes>
      <Trailer openTrailer={openTrailer} setOpenTrailer={setOpenTrailer} trailerKey={trailerKey} />
    </BrowserRouter>
  );
};

export default AppRouter;
