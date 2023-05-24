import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert';
import Web3Modal from "web3modal";
import {BigNumber, Contract, providers, utils} from 'ethers';
import { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS, CRYPTO_DEV_NFT_CONTRACT_ADDRESS, CRYPTO_DEV_TOKEN_ABI, CRYPTO_DEV_NFT_ABI } from '../constants';
import { useWindowSize, useWindowHeight, useWindowWidth } from '@react-hook/window-size'
import SnackBar from '../components/SnackBar'
import ConfettiDrop from '../components/ConfettiDrop';
import BackDropLoading from '../components/BackDropLoading';
import CustomModal from '../components/CustomModal';
import MintOrClaim from '../components/MintOrClaim';
import Typography from '@mui/material/Typography'
import ButtonWithLoading from '../components/ButtonWithLoading';
import PositionedSnackbar from '../components/SnackBarFeed';

const Home = () => {

const zero = BigNumber.from(0);
const [walletConnected, setWalletConnected] = useState(false);
const [loading, setLoading] = useState(false);
const [showErrorAccount, setShowErrorAccount] = useState(false);
const web3ModalRef = useRef();
const [openBackDrop, setOpenBackDrop] = useState(false)
const [needMetamsk, setNeedMetamsk] = useState(false)
const [isMaxMinted, setIsMaxMinted] = useState(false);
const [isEligibleToClaim, setIsEligibleToClaim] = useState(false);
const [ mynBalance, setMyBalance ] = useState(zero)
const [totalTokenMinted, setTotalTokenMinted] = useState(zero);
const [mintAmount, setMintAmount] = useState('0');
const [tokensToclaim, setTokensToclaim] = useState(0)
const [ claimLoading, setClaimLoading ] = useState(false);
const [successFeedMinted, setSuccessFeedMinted] = useState(false);
const [successFeedClaimed, setSuccessFeedClaimed] = useState(false);

const handleMintAmount = (e) => {
    var input = e.target.value;
    input = input.split('')
    input = input.filter((val) => /(\d|\.)/.test(val))
    input = input.join('')
    var dotResult = input.match(/\./g)
    dotResult = dotResult || ['']

    if(input.startsWith('.')) {
     return setMintAmount('')
    }
    if(dotResult.length <= 1) {
        return setMintAmount(input)
    }
    else{
        return input
    }
    
    
}

const getProviderOrSigner = async (needSigner = false) => {
    try {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider)
        const {chainId} = await web3Provider.getNetwork();
        
        if(chainId != 5) {
            window.alert("Please switch to Goerli network");
            throw new Error("Switch to Goerli Network");
        }

        if(needSigner) {
            const signer = await web3Provider.getSigner();
            return signer;
        } else {
            return web3Provider;
        }
    } catch (err) {
        console.log(err)
    }
}

const getContract = async (contractAddress, ABI, needSigner=false) => {
    try {
        if(needSigner) {
            const providerOrSigner = await getProviderOrSigner(true);
            return new Contract(contractAddress, ABI, providerOrSigner);
        }else{
            const providerOrSigner = await getProviderOrSigner();
            return new Contract(contractAddress, ABI, providerOrSigner);                
        }
    
    } catch (err) {
        console.log(err)
    }
}

const claim = async() => {
    try {
        const cryptoDevTokenContract = await getContract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_ABI,
            true
        );
        setClaimLoading(true)
        const tx = await cryptoDevTokenContract.claim();
        await tx.wait();
        setSuccessFeedClaimed(true);
        setTimeout(() => setSuccessFeedClaimed(false), 5000)
        setClaimLoading(false)
        setIsEligibleToClaim(false)
        await myTokenBalance();
        await totalMinted();
        await isEligibleToClaim();
        
    } catch (err) {
        console.log(err)
    }
}

const mint = async() => {
    try {
        if (mintAmount === 0 || mintAmount === '' || mintAmount === '0') {
            window.alert('Please Enter Token Amount');
            throw new Error('Please Enter Token Amount')
        }
        const cryptoDevTokenContract = await getContract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_ABI,
            true
        );
        const amount = parseFloat(mintAmount)
        const value = amount * 0.001
        console.log(value);
        setLoading(true)
        const tx = await cryptoDevTokenContract.mint(
            amount,
            {
                value: utils.parseEther(value.toString())
            }
        );
        await tx.wait();
        setSuccessFeedMinted(true);
        setTimeout(() => setSuccessFeedMinted(false), 5000)
        await totalMinted();
        await myTokenBalance();
        setLoading(false);
    } catch (err) {
        console.log(err)
    }
}

const totalMinted = async () => {
    try {
        const cryptoDevTokenContract = await getContract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_ABI
        );
        const totalSupply = await cryptoDevTokenContract.totalSupply()
        setTotalTokenMinted(totalSupply);
    } catch (err) {
        console.log(err)
    }
}

const myTokenBalance = async () => {
    try{
        const cryptoDevTokenContract = await getContract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_ABI
        );
        const provider = await getProviderOrSigner(true);
        const address = await provider.getAddress();
        const myTokenBalance = await cryptoDevTokenContract.balanceOf(address);
        setMyBalance(myTokenBalance);
    }catch(err){
        console.log(err)
    }
}

const eligibleToClaim = async() => {
    try {
        const cryptoDevNftContract = await getContract(
            CRYPTO_DEV_NFT_CONTRACT_ADDRESS,
            CRYPTO_DEV_NFT_ABI
        );
        const cryptoDevTokenContract = await getContract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_ABI
        );
        const provider = await getProviderOrSigner(true);
        const address = await provider.getAddress();
        const nftBalance = await cryptoDevNftContract.balanceOf(address);
        let amount = 0;

        if(nftBalance === zero) {
            setIsEligibleToClaim(false)
        }else {
            for (let i = 0; i < nftBalance; i++) {
                const tokenId = cryptoDevNftContract.tokenOfOwnerByIndex(address, i);
                
                if (!(await cryptoDevTokenContract.tokenIdsClaimed(tokenId))) {
                    amount++
                }
            }
            if (amount > 0) {
                const claimAmount = amount * 10;
                setIsEligibleToClaim(true)
                setTokensToclaim(claimAmount)
            } else {
                setIsEligibleToClaim(false)
                setTokensToclaim(0)
            } 
        }
        
    } catch (err) {
        console.log(err)
    }
}


const connectWallet = async() => {
    try {
        await getProviderOrSigner();
        setWalletConnected(true);
        await myTokenBalance();
        await eligibleToClaim();
        await totalMinted();
    } catch (err) {
       // window.alert("Can't connect to wallet")
        console.error(err);
    }
}

const renderButton = () => {
    if(!walletConnected) {
        return (
            <Button 
                variant="contained" 
                sx={{textTransform: 'none'}}
                onClick={connectWallet}
                color="primary">
                    connect wallet
            </Button>
        );
    }
    else {
            return(
                <Box>
                    {isEligibleToClaim && <Grid container sx={{
                            marginBottom:3,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Grid item sm={12} xs={12} md={9} lg={9}>
                                    <Box sx={{
                                    diaplay: 'flex',
                                    
                                }}>
                                    <Typography variant="body1" sx={{
                                        fontWeight: 'bold',
                                        color: 'rgb(37, 175, 50)',
                                        fontFamily: 'monospace',
                                        
                                    }} >
                                        Congratulation! you can claim {tokensToclaim} tokens
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                display: 'flex',
                                justifyContent: {
                                    md: 'start',
                                    sm:'right',
                                    xs: 'right'
                                },
                                marginTop: {
                                    md: 0,
                                    sm: 2,
                                    xs: 2
                                }
                            }} sm={12} xs={12} md={1} lg={1}>
                                <ButtonWithLoading loading={claimLoading} onClick={claim} color='success' variant='outlined'>
                                    claim
                                </ButtonWithLoading>
                            </Grid>
                        </Grid>}
                        <MintOrClaim loading={loading} buttonTitle='mint' onChange={handleMintAmount} onClick={mint} />                            
                </Box>
            )
        

    }
    
}

useEffect(() => {
    
    if(!walletConnected) {
        web3ModalRef.current = new Web3Modal({
            network: 'goerli',
            providerOptions: {},
            disableInjectedProvider: false
        });
        connectWallet();
        
    }
}, [walletConnected])

  return (
    <div style={{paddingLeft: '60px', paddingRight: '60px'}}>
        {successFeedMinted && <PositionedSnackbar alertMessage={`You have successfully minted ${mintAmount} token(s)`} />}
        {successFeedClaimed && <PositionedSnackbar alertMessage={`You have successfully claimed ${tokensToclaim} token(s)`} />}
        <SnackBar />
        {needMetamsk && <CustomModal />}
        <BackDropLoading open={openBackDrop} />
        <Head>
            <title>Crypto Dev</title>
            <meta name='description' content='Crypto Devs Nft whitelist page' />
        </Head>
      { showErrorAccount && <Alert variant='filled' severity='error' sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
            <b>Error!!</b> Change to Goerli Network
        </Alert>}
        <Container className={styles.muiContainer} >
            <Grid container sx={{
                position: 'relative',
                flexDirection: {
                    md: 'row',
                    sm: 'column-reverse',
                    xs: 'column-reverse'
                },
                top: {
                    md: process.env.NODE_ENV == "production" ? '100px': 0 ,
                    sm: '-50px',
                    xs: '-40px'
                },
            }}>
                <Grid item sm={12} xs={12} md={6} lg={6}>
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        
                    }}>
                        <Box>
                        <h3 className={styles.title}>
                            Welcome to Crypto Devs ICO
                        </h3>
                        <p className={styles.description}>
                            It&apos;s a token for developers in crypto.
                        </p>
                        <p className={styles.description}>
                            You have minted <span className={styles.minted}>{utils.formatEther(mynBalance)}</span> crypto dev tokens
                        </p>
                        <p className={styles.description}>
                            {utils.formatEther(totalTokenMinted)} out of 10&#44;000 had already been minted
                        </p>
                        <div>
                            {renderButton()}
                        </div>
                        </Box>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12} md={6} lg={6}>
                    <Box sx={{
                        display: {
                            md: 'flex',
                            lg: 'flex',
                            xl: 'flex',
                            sm: 'flex',
                            xs: 'flex'
                        },
                        
                        transform: {
                            md: 'scale(1)',
                            xs: 'scale(0.5)',
                            sm: 'scale(0.5)'
                        },
                        height: {
                            md: 'auto',
                            sm: '200px',
                            xs: '200px'
                        },
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <img className={styles.bounce} src='./cd.png' width={350} height={350} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
        <footer className={styles.footer}>
            My ICO demo
        </footer>
    </div>
  )
}

export default Home