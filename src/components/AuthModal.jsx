import { useRef, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import { createUser } from '../firebase/createUser';
import { loginUser } from '../firebase/loginUser';
import Error from './Error';
import { auth } from '../firebase/firebase.config';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const AuthModal = () => {
  const { setUserClicked, userClicked, userLogged, setUserLogged, noAccount, setNoAccount, setFirebaseActiveUser } = useContext(Context);

  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: '' });
  const navigate = useNavigate();

  function setAppForActiveUser(user) {
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
            setAppForActiveUser(user);
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/email-already-in-use':
                setErrorMessage({ active: true, text: 'That email is already registered' });
                break;
              case 'auth/weak-password':
                setErrorMessage({ active: true, text: 'password should have at least 6 characters' });
                break;
              default:
                setErrorMessage({ active: true, text: 'There was an unexpected error, please trying again.' });
            }
          })
      : loginUser(userData)
          .then((user) => {
            setAppForActiveUser(user);
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/invalid-credential':
                setErrorMessage({ active: true, text: 'incorrect email o password, try again.' });
                break;
              case 'auth/too-many-requests':
                setErrorMessage({ active: true, text: 'Too many invalid requests, wait a couple of minutes before trying again.' });
                break;
              default:
                setErrorMessage({ active: true, text: 'There was an unexpected error, please trying again.' });
            }
            setUserLogged(false);
            setUserClicked(true);
          });
  };
  const handleLogout = async () => {
    auth.signOut().then((e) => {
      setUserLogged(false);
      setUserData({ username: '', email: '', password: '' });
      setFirebaseActiveUser({ email: null, uid: null });
      setErrorMessage({ active: false, text: '' });
      setUserClicked(false);
      navigate('/movies');
    });
  };

  return (
    <>
      <Dialog style={{backgroundColor: '#0000005e'}}
        open={userClicked}
        onClose={() => {
          setUserClicked(false);
        }}
        aria-labelledby='responsive-dialog-title'
      >

      <DialogActions  style={{backgroundColor:'white', padding: '0'}}>
        <Button
          style={{ backgroundColor: '', color: 'black' }}
          className='button'
          onClick={() => {
            setUserClicked(false);
          }}
        >
          <i class="bi bi-x-circle"></i>
        </Button>
      </DialogActions>

        <DialogContent style={{ backgroundColor: 'white', textShadow: 'none', color:'black' }}>
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
                {noAccount ? 'Sign up' : 'Login'}
                <form onSubmit={(e) => handleSubmit(e)}>
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
                        setErrorMessage({ active: false, text: '' });
                      }}
                      className='opt'
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
                      className='opt'
                    >
                      Create account
                    </Link>
                  </p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModal;
