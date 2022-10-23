import { useState } from "react";
const Navbar = ({ setSearchSection }) => {
  const [navBar, setNavBar] = useState(false);

  const navBarState = navBar ? "links-active" : "links-inactive";

  return (
    <nav className="nav" onClick={(event) => {handleSearch(event)}}>
      <a href="#"><i className="bi bi-bullseye" id="logo"></i></a>

      <ul className={`${navBarState} links`}>
        <li><a href="#">TV Shows</a></li>
        <li><a href="#">Movies</a></li>
      </ul>

      <i className="bi bi-search" id="search-btn" onClick={()=> {setSearchSection(true)}}></i>

      <i className="bi bi-list" id="menu-icon" onClick={() => {setNavBar(!navBar)}}></i>
    </nav>
  );
};

export default Navbar;
