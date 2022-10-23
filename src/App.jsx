import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SearchSection from "./components/SearchSection";

function App() {
  const [searchSection, setSearchSection] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar setSearchSection={setSearchSection} />
        <Routes>
          <Route path="/search" element={<SearchSection searchSection={searchSection}/>}></Route>           
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
