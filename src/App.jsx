import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MovieSection from './components/MovieSection';

import Navbar from './components/Navbar';
import SearchSection from './pages/SearchSection/index';
import TvSection from './components/tvSection';
import Info from './components/Info';
import { useState } from 'react';
import { Context } from './context/Context';

function App() {
  const [currentId, setCurrentId] = useState();

  return (
    <div className='App'>
      <Context.Provider
        value={{
          currentId,
          setCurrentId,
        }}
      >
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path='/movies' element={<MovieSection />}></Route>
            <Route path='/tvshows' element={<TvSection />}></Route>
            <Route path='/search' element={<SearchSection />}></Route>

            <Route path='/movies/:id' element={<Info mediaType={'movie'} />}></Route>
            <Route path='/tvshows/:id' element={<Info mediaType={'tv'} />}></Route>

            <Route path='*' element={<Navigate to='/movies' />} />
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </div>
  );
}

export default App;
