import { useState } from 'react';
import { Context } from './context/Context';
import AppRouter from './router/AppRouter';

function App() {
  const [currentId, setCurrentId] = useState();
  const [openTrailer, setOpenTrailer] = useState('');
  const [trailerKey, setTrailerKey] = useState('');
  
  return (
    <Context.Provider value={{ currentId, setCurrentId, openTrailer, setOpenTrailer,trailerKey, setTrailerKey}}>
      <div className='App'>
        <AppRouter />
      </div>
    </Context.Provider>
  );
}

export default App;
