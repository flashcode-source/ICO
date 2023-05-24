import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const BackDropLoading = ({open}) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            >
            <CircularProgress color="inherit" sx={{marginRight: 3}} />
            Connecting
            
        </Backdrop>
    )
}

export default BackDropLoading