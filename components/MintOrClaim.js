import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import styles from '../styles/Home.module.css'
import ButtonWithLoading from "./ButtonWithLoading";

const MintOrClaim = ({loading, buttonColor, onClick, buttonTitle, readOnly, onChange, sx, value}) => {
  return (
    <Grid container sx={sx}>
        <Grid item >
            <input type='text' value={value} readOnly={readOnly} onChange={(e) => onChange(e)} className={styles.input_field} placeholder='Enter amount of token' />
        </Grid>
        <Grid item md={1} sm={12} xs={12} sx={{
          display: 'flex',
          justifyContent: {
              
              sm:'right',
              xs: 'right'
          },
          marginTop: {
              md: 0,
              sm: 2,
              xs: 2
          }
        }}>
            <ButtonWithLoading 
                loading={loading}
                variant="contained" 
                className={styles.btn}
                onClick={onClick}
                color={buttonColor || "primary"} >
                  {buttonTitle}
              </ButtonWithLoading>
        </Grid>
    </Grid>    
  )
}

export default MintOrClaim