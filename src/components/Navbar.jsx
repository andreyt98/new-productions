import { useRef, useEffect, useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../context/Context';

import AuthModal from './AuthModal';

const Navbar = () => {
  const navRef = useRef();
  const { setCurrentMediaType, userClicked, setUserClicked, userLogged, firebaseActiveUser } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState({ active: false, text: '' });

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.innerWidth >= 640) {
        if (window.scrollY > 0) {
          navRef.current.style.backgroundColor = '#0007';
          navRef.current.style.backdropFilter = 'blur(8px)';
        } else {
          navRef.current.style.background = 'none';
          navRef.current.style.backdropFilter = 'none';
        }
      } else {
          navRef.current.style.backgroundColor = '#0007';
          navRef.current.style.backdropFilter = 'blur(8px)';
       }
    });
  }, []);

  return (
    <nav className='nav' ref={navRef}>
      <NavLink to='search' id='search-btn' className='nav-item-box'>
        <i className='bi bi-search'></i>
        <p className='to-hide-on-desk'>search</p>
      </NavLink>

      <ul className={` links`}>
        <li>
          <NavLink className='nav-item-box' 
            to='movies'
            onClick={() => {
              setCurrentMediaType('movies');
            }}
          >
            <i className="bi bi-camera-reels to-hide-on-desk"></i>
            <p>Movies</p>
          </NavLink>
        </li>
        <li>
          <NavLink className='nav-item-box'
            to='tvshows'
            onClick={() => {
              setCurrentMediaType('tvshows');
            }}
          >
            <i className="bi bi-tv to-hide-on-desk"></i>
            <p>TV Shows</p>
          </NavLink>
        </li>
      </ul>
      <Link className='nav-item-box'
        onClick={() => {
          setUserClicked(!userClicked);
          if (errorMessage.active) {
            setErrorMessage({ active: false, text: '' });
          }
        }}        
      >
        <i className='bi bi-person-circle' id='user'></i>
        <p className='to-hide-on-desk'>Me</p>
      </Link>

      {userClicked && (
        <AuthModal />
      )}
    </nav>
  );
};

export default Navbar;
