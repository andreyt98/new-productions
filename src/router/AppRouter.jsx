import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MovieSection from '../pages/MovieSection/MovieSection';
import Navbar from '../components/Navbar';
import SearchSection from '../pages/SearchSection/index';
import TvSection from '../pages/TvSection/TvSection';
import Trailer from '../components/Trailer';
import MediaData from '../components/MediaData';
import MediaDetails from '../pages/MediaDetails/MediaDetails';
import Profile from '../pages/Profile/Profile';
import FirstTimeVisitModal from '../components/FirstTimeVisitModal';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <MediaData />
      <FirstTimeVisitModal/>
      <Routes>
        <Route path='/movies' element={<MovieSection />}></Route>
        <Route path='/tvshows' element={<TvSection />}></Route>
        <Route path='/search' element={<SearchSection />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/profile/:id' element={<MediaDetails />}></Route>

        <Route path='/movies/:id' element={<MediaDetails />}></Route>
        <Route path='/tvshows/:id' element={<MediaDetails />}></Route>
        <Route path='/search/:id' element={<MediaDetails />}></Route>

        <Route path='*' element={<Navigate to='/movies' />} />
      </Routes>
      <Trailer />
    </BrowserRouter>
  );
};

export default AppRouter;
