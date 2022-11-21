import { Link, NavLink } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="nav">
      <Link to="/"><i className="bi bi-bullseye" id="logo"></i></Link>

      <NavLink to="search" id="search-btn"><i className="bi bi-search"></i></NavLink>
      <ul className={` links`}>
        <li><NavLink to="movies"> Movies</NavLink></li>
        <li><NavLink to="tvshows"> TV Shows</NavLink></li>
        <li><NavLink to="Saved">  Favorites</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
