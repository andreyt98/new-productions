import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MovieSection from '../components/MovieSection';
import Navbar from '../components/Navbar';
import SearchSection from '../pages/SearchSection/index';
import TvSection from '../components/tvSection';
import Trailer from '../components/Trailer';
import MediaData from '../components/MediaData'
import SelectedMedia from '../components/SelectedMedia';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <MediaData/>

      <Routes>
        <Route path='/movies' element={<MovieSection />}></Route>
        <Route path='/tvshows' element={<TvSection />}></Route> 
        <Route path='/search' element={<SearchSection />}></Route>
        <Route path='/saved' element={<img src="https://www.londonvirginhair.com/cdn/shop/products/f186d1_8a28db63b7574babb9854cfd0805842e_mv2_900x.gif?v=1602073168" style={{height:'100vh',width:'100%', objectFit:'cover'}} />}></Route>

        <Route path='/movies/:id' element={<SelectedMedia />}></Route>
        <Route path='/tvshows/:id' element={<SelectedMedia />}></Route>
        <Route path='/search/:id' element={<SelectedMedia />}></Route>
        
        <Route path='*' element={<Navigate to='/movies' />} /> 
      </Routes>
      <Trailer/>
    </BrowserRouter>
  );
};

export default AppRouter;
