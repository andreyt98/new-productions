import { useRef, useEffect, useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../context/Context';
import { createUser } from '../firebase/createUser';
import { loginUser } from '../firebase/loginUser';

import { auth } from '../firebase/firebase.config';

const Navbar = () => {
  const navRef = useRef();
  const { setCurrentMediaType, userClicked, setUserClicked, userLogged, setUserLogged, noAccount, setNoAccount } = useContext(Context);

  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    noAccount
      ? createUser(userData).then(() => setUserLogged(true), setUserClicked(false))
      : loginUser(userData).then(() =>  setUserLogged(true), setUserClicked(false));
  };
  const handleLogout = async () => {
    auth.signOut().then((e) => setUserLogged(false));
  };

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
      <Link onClick={() => setUserClicked(!userClicked)}>
        <i className='bi bi-person-circle' id='user'></i>
      </Link>

      {userClicked && (
        <div className='user-options'>
          {userLogged ? (
            <>
              <Link>
                <i className='bi bi-person'></i> Profile{' '}
              </Link>
              <Link onClick={handleLogout}>
                <i className='bi bi-box-arrow-right'></i> Log out
              </Link>
            </>
          ) : (
            <>
              <form onSubmit={(e) => handleSubmit(e)}>
                {noAccount && (
                  <>
                    <label htmlFor=''>Username</label>
                    <input
                      type='text'
                      value={userData.username}
                      onChange={(e) => {
                        setUserData({ ...userData, username: e.target.value });
                      }}
                      required
                    />
                  </>
                )}
                <label htmlFor=''>Email</label>
                <input
                  type='Email'
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  required
                />

                <label htmlFor=''>Password</label>
                <input
                  type='password'
                  onChange={(e) => {
                    setUserData({ ...userData, password: e.target.value });
                  }}
                  required
                />

                <button type='submit'>{noAccount ? 'Create account' : 'Login'}</button>
              </form>
              {noAccount ? (
                <p>
                  Already have an account?{' '}
                  <Link onClick={() => setNoAccount(false)} class='opt'>
                    Login
                  </Link>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <Link onClick={() => setNoAccount(true)} class='opt'>
                    Create account
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
