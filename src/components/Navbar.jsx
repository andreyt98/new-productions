import { useRef, useEffect, useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../context/Context';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';

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
      <NavLink to='search' id='search-btn'>
        <i className='bi bi-search'></i>
      </NavLink>

      <ul className={` links`}>
        <li>
          <NavLink
            to='movies'
            onClick={() => {
              setCurrentMediaType('movies');
            }}
          >
            {' '}
            Movies
          </NavLink>
        </li>
        <li>
          <NavLink
            to='tvshows'
            onClick={() => {
              setCurrentMediaType('tvshows');
            }}
          >
            {' '}
            TV Shows
          </NavLink>
        </li>
      </ul>
      <Link
        onClick={() => {
          setUserClicked(!userClicked);
          if (errorMessage.active) {
            setErrorMessage({ active: false, text: '' });
          }
        }}
      >
        {userLogged ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.4rem' }}>
            <Avatar sx={{ bgcolor: deepPurple[500], width: 28, height: 28 }}>{firebaseActiveUser && firebaseActiveUser.email.charAt(0).toUpperCase()}</Avatar>
            <i className='bi bi-caret-down-fill' style={{ fontSize: '14px' }}></i>
          </div>
        ) : (
          <i className='bi bi-person-circle' id='user'></i>
        )}
      </Link>

      {userClicked && (
        <AuthModal />
      )}
    </nav>
  );
};

export default Navbar;
