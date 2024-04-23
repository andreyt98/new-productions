import { useRef, useEffect, useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import { createUser } from '../firebase/createUser';
import { loginUser } from '../firebase/loginUser';
import Error from './Error';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';


import { auth } from '../firebase/firebase.config';

const Navbar = () => {
  const navRef = useRef();
  const { setCurrentMediaType, userClicked, setUserClicked, userLogged, setUserLogged, noAccount, setNoAccount,firebaseActiveUser, setFirebaseActiveUser } = useContext(Context);

  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: '' });
  const navigate = useNavigate();

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

  function setAppForActiveUser(){
    setFirebaseActiveUser({ email: user.user.email, uid: user.user.uid });
    setUserLogged(true);
    setUserClicked(false);
    setErrorMessage({ active: false, text: '' });
    setUserData({ username: '', email: '', password: '' });
    navigate('/profile');
  }
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    noAccount
      ? createUser(userData)
          .then((user) => {
            setAppForActiveUser();
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/email-already-in-use':
                setErrorMessage({ active: true, text: 'That email is already registered' });
                break;
            }
            switch (error.code) {
              case 'auth/weak-password':
                setErrorMessage({ active: true, text: 'password should have at least 6 characters' });
                break;
            }
          })
      : loginUser(userData)
          .then((user) => {
            setAppForActiveUser();
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/invalid-credential':
                setErrorMessage({ active: true, text: 'incorrect email o password, try again.' });
                break;
            }
            switch (error.code) {
              case 'auth/too-many-requests':
                setErrorMessage({ active: true, text: 'Too many invalid requests, wait a couple of minutes before trying again.' });
                break;
            }
            setUserLogged(false);
            setUserClicked(true);
          });
  };
  const handleLogout = async () => {
    auth.signOut().then((e) => {
      setUserLogged(false);
      setUserData({ username: '', email: '', password: '' });
      setErrorMessage({ active: false, text: '' });
      setUserClicked(false);
      navigate('/movies');
    });
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
      <Link
        onClick={() => {
          setUserClicked(!userClicked);
          if (errorMessage.active) {
            setErrorMessage({ active: false, text: '' });
          }
        }}
      >
        {userLogged ?
          <div style={{display:'flex', justifyContent: 'center', alignItems:'center', gap:'.4rem'}}>
            <Avatar sx={{ bgcolor: deepPurple[500], width: 28, height: 28 }}>{firebaseActiveUser && firebaseActiveUser.email.charAt(0).toUpperCase()}</Avatar>  
          <i className="bi bi-caret-down-fill" style={{fontSize: '14px'}}></i>
          </div>
          :
          <i className='bi bi-person-circle' id='user'></i>
        }
 

      </Link>

      {userClicked && (
        <div className='user-options'>
          {userLogged ? (
            <>
              <Link
                to={'/profile'}
                onClick={() => {
                  setUserClicked(false);
                }}
              >
                <i className='bi bi-person'></i> Profile{' '}
              </Link>
              <Link to={''} onClick={handleLogout}>
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

                {errorMessage.active && <Error errorMessage={errorMessage} />}

                <button type='submit'>{noAccount ? 'Create account' : 'Login'}</button>
              </form>
              {noAccount ? (
                <p>
                  Already have an account?{' '}
                  <Link
                    onClick={() => {
                      setNoAccount(false);
                      setErrorMessage({ active: false, text: '' }
                    )}}
                    class='opt'
                  >
                    Login
                  </Link>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <Link
                    onClick={() => {
                      setNoAccount(true);
                      setErrorMessage({ active: false, text: '' });
                    }}
                    class='opt'
                  >
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
