import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import Link from 'next/link';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
const centerStyle = {
    display: 'flex',
    justifyContent: 'center'
  }

export default function CustomModal() {
  const route = useRouter();
  const redirect = () => {
    route.push("https://metamask.io")
  }


  return (
    <div>
      <Modal open={true} disableEnforceFocus disableAutoFocus>
        <Box sx={style}>
            <Box sx={centerStyle}>
              <img src='mtmsk.png' />
            </Box>
            <Box sx={centerStyle}>
              <ul>
                <li>Install metamask</li>
                <li>Switch network to goerli testnet</li>
                <li>Make sure you have goerli ETH</li>
                <li>You can get goerli ETH <Link href="https://goerlifaucet.com">https://goerlifaucet.com</Link></li>
              </ul>
            </Box>
            <Box sx={centerStyle}>
              <Link href="https://metamask.io" target="_blank">
                <Button variant="outlined" color="primary">
                  Install Metamask
                </Button>
              </Link>
            </Box>
        </Box>
      </Modal>
    </div>
  );
}