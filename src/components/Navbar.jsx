import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [navBar, setNavBar] = useState(false);

  const navBarState = navBar ? "links-active" : "links-inactive";

  return (
    <nav className="nav">
      <Link to="/" end><i className="bi bi-bullseye" id="logo"></i></Link>

      <ul className={`${navBarState} links`}>
        <li><NavLink to="tvshows" onClick={() => {setNavBar(false)}}>TV Shows</NavLink></li>
        <li><NavLink to="movies" onClick={() => {setNavBar(false)}}>Movies</NavLink></li>
      </ul>

      <NavLink to="search" id="search-btn"><i className="bi bi-search"></i></NavLink>

      <i className="bi bi-list" id="menu-icon" onClick={() => {setNavBar(!navBar)}}></i>
    </nav>
  );
};

export default Navbar;
