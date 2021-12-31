import * as anchor from '@project-serum/anchor';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { PhaseCountdown } from './countdown';
import { toDate } from './utils';
import { FairLaunchAccount } from './fair-launch';
import { CandyMachineAccount } from './candy-machine';
import { useWallet } from '@solana/wallet-adapter-react';
import { publicSaleSettings, whitelistSettings, welcomeSettings } from './userSettings';

export enum Phase {
  AnticipationPhase, // FL, AKA Phase 0
  SetPrice, // FL, AKA Phase 1
  GracePeriod, // FL, AKA Phase 2
  Lottery, // FL
  RaffleFinished, // FL, AKA Phase 3
  WaitForCM, // FL,
  Phase4,
  MintOff,
  WhiteListMint,
  PublicMint,
  Welcome,
}

export function getPhase(
  fairLaunch: FairLaunchAccount | undefined,
  candyMachine: CandyMachineAccount | undefined,
): Phase {
  const curr = new Date().getTime();
  const candyMachineGoLive = toDate(candyMachine?.state.goLiveDate)?.getTime();
  const whiteListStart = toDate(whitelistSettings.startDate)?.getTime();

//Countdown, WhiteList Minting, Public Minting,



  if (candyMachineGoLive && curr > candyMachineGoLive) {
    return Phase.PublicMint;
  } 
  else if (whitelistSettings.enabled && whiteListStart && curr > whiteListStart ) {
    return Phase.WhiteListMint;
  } else {
  return Phase.Welcome;
  }

}

const Header = (props: {
  phaseName: string;
  desc: string;
  date: anchor.BN | undefined;
  status?: string;
  countdown?: boolean;
  countdownEnable?: boolean;
}) => {
  const { phaseName, desc, date, status, countdownEnable } = props;
  return (
    <>
    <Grid container justifyContent="center" className='mintHeader pb-2' alignItems='center'>
      <Grid xs={12} justifyContent="center" direction="column">
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          {phaseName}
        </Typography>
        
      </Grid>
      <Grid xs={12} container justifyContent="center">
      {countdownEnable === true && (
          <PhaseCountdown
          date={toDate(date)}
          style={{ justifyContent: 'flex-end' }}
          status={status || 'COMPLETE'}
        />
        )}
        
      </Grid>
    </Grid>
    <Typography className='pb-2' variant="body1" color="textSecondary">
      {desc}
    </Typography>
  </>
  );
};

type PhaseHeaderProps = {
  phase: Phase;
  fairLaunch?: FairLaunchAccount;
  candyMachine?: CandyMachineAccount;
  candyMachinePredatesFairLaunch: boolean;
  rpcUrl: string;
};

export const PhaseHeader = ({
  phase,
  fairLaunch,
  candyMachine,
  candyMachinePredatesFairLaunch,
  rpcUrl,
}: PhaseHeaderProps) => {
  const wallet = useWallet();
  console.log('D', candyMachine);
  console.log('Wallet', wallet);

  return (
    <>
     
      {phase === Phase.Welcome && !candyMachine && (
        <Header
          phaseName={welcomeSettings.title}
          desc={welcomeSettings.desc}
          date={welcomeSettings.countdownTo}
          countdownEnable={welcomeSettings.countdownEnable}
        />
      )}

      {phase === Phase.Welcome && candyMachine && (
        <Header
          phaseName={welcomeSettings.title2}
          desc={welcomeSettings.desc2}
          date={welcomeSettings.countdownTo}
          countdownEnable={welcomeSettings.countdownEnable}
        />
      )}

        {phase === Phase.WhiteListMint && candyMachine && (
        <>
        <Header
          phaseName={whitelistSettings.title}
          desc={whitelistSettings.desc}
          date={whitelistSettings.endDate}
          status="WHITELIST LIVE"
        />
        {whitelistSettings.itemsAvailable === true && (
          <p className='pb-2'>Items Available: {candyMachine?.state.itemsAvailable}</p>
        )}
        {whitelistSettings.itemsRemaining === true && (
          <p className='pb-2'>Items Remaining: {candyMachine?.state.itemsRemaining}</p>
        )}
        {whitelistSettings.itemsRedeemed === true && (
          <p className='pb-2'>Items Redeemed: {candyMachine?.state.itemsRedeemed}</p>
        )}
      
        </>  
        
      )}

      {phase === Phase.WhiteListMint && !candyMachine && (
        <>
        <Header
          phaseName={whitelistSettings.title2}
          desc={whitelistSettings.desc2}
          date={whitelistSettings.endDate}
          status="WHITELIST LIVE"
        />
      
        </>  
        
      )}

      {phase === Phase.PublicMint && (
        <>
        <Header
          phaseName={publicSaleSettings.title}
          desc={publicSaleSettings.desc}
          date={candyMachine?.state.goLiveDate}
          status="LIVE"
        />
        {publicSaleSettings.itemsAvailable === true && (
          <p className='pb-2'>Items Available: {candyMachine?.state.itemsAvailable}</p>
        )}
        {publicSaleSettings.itemsRemaining === true && (
          <p className='pb-2'>Items Remaining: {candyMachine?.state.itemsRemaining}</p>
        )}
        {publicSaleSettings.itemsRedeemed === true && (
          <p className='pb-2'>Items Redeemed: {candyMachine?.state.itemsRedeemed}</p>
        )}
      
        </>  
        
      )}

        
    </>
  );
};