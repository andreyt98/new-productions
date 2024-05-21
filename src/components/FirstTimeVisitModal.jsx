import { useContext } from 'react';
import { Context } from '../context/Context';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';

const FirstTimeVisitModal = () => {
  const { isMember, openDialog, setOpenDialog, setUserClicked } = useContext(Context);

  return (
    !isMember && (
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle style={{ textShadow: 'none' }} id='responsive-dialog-title'>
          {`There's more! `}

          <img style={{ width: '20px' }} src='https://em-content.zobj.net/source/apple/391/grinning-face_1f600.png' alt='' />
        </DialogTitle>
        <DialogContent style={{ textShadow: 'none' }}>
          <DialogContentText style={{ background: '' }}>
            Consider{' '}
            <Link
              to='#'
              onClick={() => {
                setUserClicked(true);
                setOpenDialog(false);
              }}
              style={{ color: '#00a87e', textDecoration: 'underline' }}
            >
              signing up
            </Link>{' '}
            for free to access all functionalities.
            <p style={{ fontSize: '80%', marginTop: '10px', fontStyle: 'italic' }}>
              Or{' '}
              <span
                onClick={() => {
                  setOpenDialog(false);
                }}
                style={{ cursor: 'pointer', fontStyle: 'underline', textDecoration: 'underline' }}
              >
                close this message
              </span>{' '}
              to keep navigating.
            </p>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  );
};

export default FirstTimeVisitModal;
