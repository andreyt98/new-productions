import { useState } from 'react';
import { Context } from './context/Context';
import AppRouter from './router/AppRouter';

function App() {
  const [currentId, setCurrentId] = useState();
  const [openTrailer, setOpenTrailer] = useState('');
  const [trailerKey, setTrailerKey] = useState('');
  const [cast, setCast] = useState('')
  const [currentMediaType, setCurrentMediaType] = useState(window.location.pathname.slice(1));
  const [apiData, setApiData] = useState([])

  return (

    <Context.Provider value={{ currentId, setCurrentId, openTrailer, setOpenTrailer,trailerKey, setTrailerKey,
    currentMediaType,setCurrentMediaType,apiData, setApiData, cast, setCast}}>
      <div className='App'>
        <AppRouter />
      </div>
    </Context.Provider>
  );
}

export default App;
