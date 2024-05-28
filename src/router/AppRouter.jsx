import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const MediaDetails = lazy(() => import('../pages/MediaDetails/MediaDetails'));
const MovieSection = lazy(() => import('../pages/MovieSection/MovieSection'));
const Navbar = lazy(() => import('../components/Navbar'));
const SearchSection = lazy(() => import('../pages/SearchSection/index'));
const TvSection = lazy(() => import('../pages/TvSection/TvSection'));
const Trailer = lazy(() => import('../components/Trailer'));
const MediaData = lazy(() => import('../components/MediaData'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const FirstTimeVisitModal = lazy(() => import('../components/FirstTimeVisitModal'));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense>
        <Navbar />
        <MediaData />
        <FirstTimeVisitModal />
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
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
