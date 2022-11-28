import { useState } from 'react';
import { Context } from './context/Context';
import AppRouter from './router/AppRouter';

function App() {
  const [currentId, setCurrentId] = useState();

  return (
    <Context.Provider value={{ currentId, setCurrentId, }}>
      <div className='App'>
        <AppRouter />
      </div>
    </Context.Provider>
  );
}

export default App;
