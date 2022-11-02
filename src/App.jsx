import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieSection from "./components/MovieSection";

import Navbar from "./components/Navbar";
import SearchSection from "./components/SearchSection";
import TvSection from "./components/tvSection";

function App() {
  const [openTrailer, setOpenTrailer] = useState("");
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        
        <Routes>
          <Route path="/" element={<TvSection/>} ></Route>
          <Route path="/tvshows" element={<TvSection openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>} ></Route>
          <Route path="/movies" element={<MovieSection openTrailer={openTrailer} setOpenTrailer={setOpenTrailer}/>} ></Route>
          <Route path="/search" element={<SearchSection/>}></Route>           
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
