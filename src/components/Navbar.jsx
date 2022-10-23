import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ setSearchSection }) => {
  const [navBar, setNavBar] = useState(false);

  const navBarState = navBar ? "links-active" : "links-inactive";

  return (
    <nav className="nav" onClick={(event) => {handleSearch(event)}}>
      <NavLink to="/" end><i className="bi bi-bullseye" id="logo"></i></NavLink>

      <ul className={`${navBarState} links`}>
        <li><NavLink to="tvshows">TV Shows</NavLink></li>
        <li><NavLink to="movies">Movies</NavLink></li>
      </ul>

    <NavLink to="search">
      <i className="bi bi-search" id="search-btn" onClick={()=> {setSearchSection(true)}}></i>
    </NavLink>

      <i className="bi bi-list" id="menu-icon" onClick={() => {setNavBar(!navBar)}}></i>
    </nav>
  );
};

export default Navbar;
