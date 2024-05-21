import { useContext } from 'react';
import { Context } from '../context/Context';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';

const FirstTimeVisitModal = () => {
  const { isMember, openDialog, setOpenDialog, setUserClicked } = useContext(Context);

  return !isMember &&
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
      }}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle style={{ textShadow: 'none' }} id='responsive-dialog-title'>
        {'Sign up for free '}

        <img style={{ width: '20px' }} src='https://em-content.zobj.net/source/apple/391/grinning-face_1f600.png' alt='' />
      </DialogTitle>
      <DialogContent style={{ textShadow: 'none' }}>
        <DialogContentText style={{ background: '' }}>
          This app works better if you have an account. Consider
          <Link
            to='#'
            onClick={() => {
              setUserClicked(true);
              setOpenDialog(false);
            }}
            style={{ color: '#00a87e' }}
          >
            {' '}
            signing up{' '}
          </Link>{' '}
          to access all functionalities.
          <p style={{ fontSize: '70%', marginTop: '10px', fontStyle: 'italic' }}>this message will be displayed just once.</p>
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ background: '' }}>
        <Button
          style={{ backgroundColor: '#2727271c', fontSize: '70%', padding: '1px 7px', color: '#4e4e4e', borderRadius: '25px' }}
          className='button'
          onClick={() => {
            setOpenDialog(false);
          }}
        >
          close
        </Button>
      </DialogActions>
    </Dialog>
};

export default FirstTimeVisitModal;
