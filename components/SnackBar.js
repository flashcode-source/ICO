import Snackbar from '@mui/material/Snackbar';
import { Offline, Online } from "react-detect-offline";
import Alert from '@mui/material/Alert';

const SnackBar = () => {
    return (
        <div>
            <Offline>
                <Snackbar open={true} autoHideDuration={6000}>
                    <Alert variant='filled' severity="error" sx={{ width: '100%' }}>
                        No internet access!!
                    </Alert>
                </Snackbar>
            </Offline>
        </div>
    )
}

export default SnackBar;