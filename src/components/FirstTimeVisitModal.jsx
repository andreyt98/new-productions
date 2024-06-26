import { useContext } from 'react';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
const FirstTimeVisitModal = () => {
  const { isMember, openDialog, setOpenDialog, setUserClicked } = useContext(Context);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenDialog(false);
  };

  return (
    !isMember && (
      <Snackbar
        open={openDialog}
        autoHideDuration={54000}
        onClose={handleClose}
        style={{ fontSize: '90%' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }} 
      >
        <Alert
          onClose={() => {
            setOpenDialog(false);
          }}
          severity={'info'}
          variant='filled'
          sx={{ width: '100%' }}
        >
          Consider{' '}
          <Link
            to='#'
            onClick={() => {
              setUserClicked(true);
              setOpenDialog(false);
            }}
            style={{ color: 'white', textDecoration: 'underline' }}
          >
            signing up
          </Link>{' '}
          for free to access all functionalities.
        </Alert>
      </Snackbar>
    )
  );
};

export default FirstTimeVisitModal;
