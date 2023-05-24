import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function PositionedSnackbar({alertMessage}) {
  const [state, setState] = React.useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
    setTimeout(handleClose, 3000)
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

 
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        
        key={vertical + horizontal}
        >
            <Alert variant='filled' severity="success" sx={{ width: '100%' }}>
                {alertMessage || 'success'}
            </Alert>          
      </Snackbar>
    </div>
  );
}