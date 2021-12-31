import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { CandyMachineAccount } from './candy-machine';
import { FairLaunchAccount } from './fair-launch';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';
import { whitelistSettings, publicSaleSettings } from './userSettings';
import { toDate }  from './utils'


export const CTAButton = styled(Button)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your styles here

export const MintButton = ({
  onMint,
  candyMachine,
  fairLaunch,
  isMinting,
  fairLaunchBalance,
  
}: {
  onMint: () => Promise<void>;
  candyMachine: CandyMachineAccount | undefined;
  fairLaunch?: FairLaunchAccount | undefined;
  isMinting: boolean;
  fairLaunchBalance: number;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);
  const whitelistStartDate = toDate(whitelistSettings.startDate)?.getTime();
  const whitelistEndDate = toDate(whitelistSettings.endDate)?.getTime();
  const publicMintStart = toDate(publicSaleSettings.startDate)?.getTime();
  const publicMintEnd = toDate(publicSaleSettings.endDate)?.getTime();

  function whiteListSaleCheck() {
    if (whitelistSettings.enabled && (whitelistStartDate && whitelistEndDate ) && Date.now() > whitelistStartDate && Date.now() < whitelistEndDate) {
      
      return true
    } else {
      
      return false
    }
  }
  
  let WhitelistMintActive = whiteListSaleCheck()
  console.log('is Whitelist Sale Active? ' + whiteListSaleCheck())

  function publicSaleCheck() {

    if (publicMintStart && publicMintEnd){
      if(Date.now() > publicMintStart && Date.now() < publicMintEnd){
        return true
      } else {
        return false
      }
    }
    else if (publicMintStart) {
      if (Date.now() > publicMintStart){
        return true
      } else {
        return false
      }
    
    }


  }

  let PublicMintActive = publicSaleCheck()

  console.log('is public sale live? '+ publicSaleCheck())
  
  console.log(candyMachine?.state.isSoldOut, isMinting, (WhitelistMintActive || PublicMintActive) ,!candyMachine?.state.isActive)

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      console.log('Minting');
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);
  return (
    <CTAButton
      disabled={
        candyMachine?.state.isSoldOut ||
        isMinting ||
        !(WhitelistMintActive || PublicMintActive)
        

      }
      onClick={async () => {
        setClicked(true);
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            setClicked(true);
          } else {
            await requestGatewayToken();
          }
        } else {
          await onMint();
          setClicked(false);
        }
      }}
      variant="contained"
    >
      {fairLaunch?.ticket?.data?.state.punched && fairLaunchBalance === 0 ? (
        'MINTED'
      ) : candyMachine?.state.isSoldOut ? (
        'SOLD OUT'
      ) : isMinting ? (
        <CircularProgress />
      
      ) : (
        'MINT'
      )}
    </CTAButton>
  );
};