import { useState } from "react";

import Navbar from "./components/Navbar";
import SearchSection from "./components/SearchSection";

function App() {
  const [searchSection, setSearchSection] = useState(false);
  return (
    <>
      <Navbar setSearchSection={setSearchSection} />
      <SearchSection searchSection={searchSection} />
    </>
  );
}

export default App;
