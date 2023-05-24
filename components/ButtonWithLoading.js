import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const ButtonWithLoading = ({loading, onClick, variant, children, className, color}) => {
    if(loading) {
        return(
            <Button 
                    variant="contained" 
                    sx={{
                        textTransform: 'none',
                    }}
                    color="primary" 
                    disabled
                    >
                        <CircularProgress 
                            color='inherit'
                            size={20}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute'
                            }}    
                        />
                        {children}
                </Button>
        )
    } else {
        return(
            <Button color={color || 'primary'} className={className} onClick={onClick} variant={variant} sx={{textTransform: 'none'}}>
                {children}
            </Button>
        )
    }
}

export default ButtonWithLoading