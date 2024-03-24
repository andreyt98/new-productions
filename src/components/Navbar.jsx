import { useRef, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../context/Context';

const Navbar = () => {
  const navRef = useRef();
  const { setCurrentMediaType, userClicked, setUserClicked, userLogged, setUserLogged, noAccount, setNoAccount } = useContext(Context);

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
              <Link onClick={() => setUserLogged(false)}>
                <i className='bi bi-box-arrow-right'></i> Log out
              </Link>
            </>
          ) : (
            <>
              <form onClick={(e) => handleSubmit(e)}>
                {noAccount || (
                  <>
                    <label htmlFor=''>Username</label>
                    <input type='text' required />
                  </>
                )}
                <label htmlFor=''>Email</label>
                <input type='Email' required />

                <label htmlFor=''>Password</label>
                <input type='password' required />

                <button type='submit'>{noAccount ? 'Login' : 'Create account'}</button>
              </form>
              {noAccount ? (
                <p>
                  Don't have an account? <Link onClick={() => setNoAccount(false)} class='opt'>Create account</Link>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <Link onClick={() => setNoAccount(true)} class='opt'>
                    Login
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
