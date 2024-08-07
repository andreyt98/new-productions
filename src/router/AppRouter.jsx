import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import NotFound from '../components/NotFound';
import { routes } from './routes';

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

          {routes.details.map((route, index) => {
            return <Route key={index} path={route} element={<MediaDetails />}></Route>;
          })}
          <Route path='/' element={<Navigate to='/movies' />}></Route>
          <Route path='/:id' element={<Navigate to='/movies' />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
        <Trailer />
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
