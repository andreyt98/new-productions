import { useRef,useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Context } from "../context/Context";

const Navbar = () => {
  const navRef = useRef();
  const {setCurrentMediaType} = useContext(Context)
  
  useEffect(() => {
   window.addEventListener("scroll", ()=> {

    if(window.innerWidth >= 640){

      if(window.scrollY>0){
        navRef.current.style.backgroundColor = "#0007"
        navRef.current.style.backdropFilter = "blur(8px)"
      }else{
        navRef.current.style.background = "none"
        navRef.current.style.backdropFilter = "none"
      }
    }else{
      navRef.current.style.backgroundColor = "#0007"
      navRef.current.style.backdropFilter = "blur(8px)"
    }
   })
  }, [])
  

  return (
    <nav className="nav" ref={navRef}>
      <Link to="/"><i className="bi bi-bullseye" id="logo"></i></Link>

      <NavLink to="search" id="search-btn"><i className="bi bi-search"></i></NavLink>
      <ul className={` links`}>
         <li><NavLink to="movies" onClick={()=>{setCurrentMediaType('movies')}}> Movies</NavLink></li>
        <li><NavLink to="tvshows" onClick={()=>{setCurrentMediaType('tvshows')}}> TV Shows</NavLink></li> 
        <li><NavLink to="Saved">  Favorites</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
