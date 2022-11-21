import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MovieSection from './components/MovieSection';

import Navbar from './components/Navbar';
import SearchSection from './pages/SearchSection/index';
import TvSection from './components/tvSection';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/movies' element={<MovieSection />}></Route>
          <Route path='/tvshows' element={<TvSection />}></Route>
          <Route path='/search' element={<SearchSection />}></Route>
          <Route path='*' element={<Navigate to='/movies' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
