import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  CircularProgress,
  Container,
  IconButton,
  Link,
  Slider,
  Snackbar,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme } from '@material-ui/core/styles';


import Alert from '@material-ui/lab/Alert';

import * as anchor from '@project-serum/anchor';

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';

import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';

import {
  FairLaunchAccount,
  getFairLaunchState,
  punchTicket,
  purchaseTicket,
} from './fair-launch';

import { AlertState, formatNumber, getAtaForMint, toDate, formatSol } from './utils';
import { CTAButton, MintButton } from './MintButton';
import { getPhase, Phase, PhaseHeader } from './PhaseHeader';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { walletSettings} from './userSettings';

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const MintContainer = styled.div``; // add your styles here

const dialogStyles: any = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });



export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  fairLaunchId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const FAIR_LAUNCH_LOTTERY_SIZE =
  8 + // discriminator
  32 + // fair launch
  1 + // bump
  8; // size of bitmask ones

const isWinner = (fairLaunch: FairLaunchAccount | undefined): boolean => {
  if (
    !fairLaunch?.lottery.data ||
    !fairLaunch?.lottery.data.length ||
    !fairLaunch?.ticket.data?.seq ||
    !fairLaunch?.state.phaseThreeStarted
  ) {
    return false;
  }

  const myByte =
    fairLaunch.lottery.data[
      FAIR_LAUNCH_LOTTERY_SIZE +
        Math.floor(fairLaunch.ticket.data?.seq.toNumber() / 8)
    ];

  const positionFromRight = 7 - (fairLaunch.ticket.data?.seq.toNumber() % 8);
  const mask = Math.pow(2, positionFromRight);
  const isWinner = myByte & mask;
  return isWinner > 0;
};

const Home = (props: HomeProps) => {
  const [fairLaunchBalance, setFairLaunchBalance] = useState<number>(0);
  const [yourSOLBalance, setYourSOLBalance] = useState<number | null>(null);
  const rpcUrl = props.rpcHost;

  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [contributed, setContributed] = useState(0);

  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const [fairLaunch, setFairLaunch] = useState<FairLaunchAccount>();
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();

  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        if (fairLaunch?.ticket.data?.state.unpunched && isWinner(fairLaunch)) {
          await onPunchTicket();
        }

        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            'singleGossip',
            true,
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!anchorWallet) {
        return;
      }

      try {
        const balance = await props.connection.getBalance(
          anchorWallet.publicKey,
        );
        setYourSOLBalance(balance);

        const whiteListTokens = await props.connection.getTokenAccountBalance(
          walletSettings.whiteListTokenId
        );

          console.log(whiteListTokens)
          
        if (props.fairLaunchId) {
          const state = await getFairLaunchState(
            anchorWallet,
            props.fairLaunchId,
            props.connection,
          );

          setFairLaunch(state);

          try {
            if (state.state.tokenMint) {
              const fairLaunchBalance =
                await props.connection.getTokenAccountBalance(
                  (
                    await getAtaForMint(
                      state.state.tokenMint,
                      anchorWallet.publicKey,
                    )
                  )[0],
                );

              if (fairLaunchBalance.value) {
                setFairLaunchBalance(fairLaunchBalance.value.uiAmount || 0);
              }
            }
          } catch (e) {
            console.log('Problem getting fair launch token balance');
            console.log(e);
          }
          if (contributed === 0) {
            const phase = getPhase(state, undefined);

            if (phase === Phase.SetPrice) {
              const ticks =
                (state.state.data.priceRangeEnd.toNumber() -
                  state.state.data.priceRangeStart.toNumber()) /
                state.state.data.tickSize.toNumber();
              const randomTick = Math.round(Math.random() * ticks);

              setContributed(
                (state.state.data.priceRangeStart.toNumber() +
                  randomTick * state.state.data.tickSize.toNumber()) /
                  LAMPORTS_PER_SOL,
              );
            } else {
              setContributed(
                (
                  state.state.currentMedian || state.state.data.priceRangeStart
                ).toNumber() / LAMPORTS_PER_SOL,
              );
            }
          }
        } else {
          console.log('No fair launch detected in configuration.');
        }
      } catch (e) {
        console.log('Problem getting fair launch state');
        console.log(e);
      }
      if (props.candyMachineId) {
        try {
          const cndy = await getCandyMachineState(
            anchorWallet,
            props.candyMachineId,
            props.connection,
          );
          setCandyMachine(cndy);
        } catch (e) {
          console.log('Problem getting candy machine state');
          console.log(e);
        }
      } else {
        console.log('No candy machine detected in configuration.');
      }
    })();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    props.fairLaunchId,
    contributed,
  ]);

  const min = formatNumber.asNumber(fairLaunch?.state.data.priceRangeStart);
  const max = formatNumber.asNumber(fairLaunch?.state.data.priceRangeEnd);
  const step = formatNumber.asNumber(fairLaunch?.state.data.tickSize);
  const median = formatNumber.asNumber(fairLaunch?.state.currentMedian);
  const phase = getPhase(fairLaunch, candyMachine);
  console.log('Phase', phase);
  const marks = [
    {
      value: min || 0,
      label: `${min} SOL`,
    },
    // TODO:L
    ...(phase === Phase.SetPrice
      ? []
      : [
          {
            value: median || 0,
            label: `${median}`,
          },
        ]),
    // display user comitted value
    // {
    //   value: 37,
    //   label: '37°C',
    // },
    {
      value: max || 0,
      label: `${max} SOL`,
    },
  ].filter(_ => _ !== undefined && _.value !== 0) as any;

  
  const onRefundTicket = async () => {
    if (!anchorWallet) {
      return;
    }

    console.log('refund');
    try {
      setIsMinting(true);
      await purchaseTicket(0, anchorWallet, fairLaunch);
      setIsMinting(false);
      setAlertState({
        open: true,
        message:
          'Congratulations! Funds withdrawn. This is an irreversible action.',
        severity: 'success',
      });
    } catch (e) {
      console.log(e);
      setIsMinting(false);
      setAlertState({
        open: true,
        message: 'Something went wrong.',
        severity: 'error',
      });
    }
  };

  const onPunchTicket = async () => {
    if (!anchorWallet || !fairLaunch || !fairLaunch.ticket) {
      return;
    }

    console.log('punch');
    setIsMinting(true);
    try {
      await punchTicket(anchorWallet, fairLaunch);
      setIsMinting(false);
      setAlertState({
        open: true,
        message: 'Congratulations! Ticket punched!',
        severity: 'success',
      });
    } catch (e) {
      console.log(e);
      setIsMinting(false);
      setAlertState({
        open: true,
        message: 'Something went wrong.',
        severity: 'error',
      });
    }
  };

  const candyMachinePredatesFairLaunch =
    candyMachine?.state.goLiveDate &&
    fairLaunch?.state.data.phaseTwoEnd &&
    candyMachine?.state.goLiveDate.lt(fairLaunch?.state.data.phaseTwoEnd);

  const notEnoughSOL = !!(
    yourSOLBalance != null &&
    fairLaunch?.state.data.priceRangeStart &&
    fairLaunch?.state.data.fee &&
    yourSOLBalance + (fairLaunch?.ticket?.data?.amount.toNumber() || 0) <
      contributed * LAMPORTS_PER_SOL +
        fairLaunch?.state.data.fee.toNumber() +
        0.01
  );

  return (
    <Container>
      
      <Container maxWidth="xs" style={{ position: 'relative' }}>
        <Paper
          style={{ padding: 24, backgroundColor: '#151A1F', borderRadius: 6 }}
        >
          <Grid container justifyContent="center" direction="column">
            <PhaseHeader
              phase={phase}
              fairLaunch={fairLaunch}
              candyMachine={candyMachine}
              rpcUrl={rpcUrl}
              candyMachinePredatesFairLaunch={!!candyMachinePredatesFairLaunch}
            />

            {!wallet.connected ? (
              <ConnectButton>
                Connect{' '}
                {[Phase.SetPrice].includes(phase) ? 'to bid' : 'to see status'}
              </ConnectButton>
            ) : (
              <div>

                {(phase === Phase.PublicMint || Phase.WhiteListMint) && (
                  <>
                    {(!fairLaunch ||
                      isWinner(fairLaunch) ||
                      fairLaunchBalance > 0) && (
                      <MintContainer>
                        
                        {candyMachine?.state.isActive &&
                        candyMachine?.state.gatekeeper &&
                        wallet.publicKey &&
                        wallet.signTransaction ? (
                          <GatewayProvider
                            wallet={{
                              publicKey:
                                wallet.publicKey ||
                                new PublicKey(CANDY_MACHINE_PROGRAM),
                              //@ts-ignore
                              signTransaction: wallet.signTransaction,
                            }}
                            // // Replace with following when added
                            // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                            gatekeeperNetwork={
                              candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                            } // This is the ignite (captcha) network
                            /// Don't need this for mainnet
                            clusterUrl={rpcUrl}
                            options={{ autoShowModal: false }}
                          >
                            <MintButton
                              candyMachine={candyMachine}
                              fairLaunch={fairLaunch}
                              isMinting={isMinting}
                              fairLaunchBalance={fairLaunchBalance}
                              onMint={onMint}
                            />
                          </GatewayProvider>
                        ) : (
                          <MintButton
                            candyMachine={candyMachine}
                            fairLaunch={fairLaunch}
                            isMinting={isMinting}
                            fairLaunchBalance={fairLaunchBalance}
                            onMint={onMint}
                          />
                        )}
                      </MintContainer>
                    )}

                    {!(
                      !fairLaunch ||
                      isWinner(fairLaunch) ||
                      fairLaunchBalance > 0
                    ) && (
                      <CTAButton
                        onClick={onRefundTicket}
                        variant="contained"
                        disabled={
                          isMinting ||
                          fairLaunch?.ticket.data === undefined ||
                          fairLaunch?.ticket.data?.state.withdrawn !== undefined
                        }
                      >
                        {isMinting ? <CircularProgress /> : 'Withdraw'}
                      </CTAButton>
                    )}
                  </>
                )}

              </div>
            )}

            <Grid
              container
              justifyContent="space-between"
              color="textSecondary"
            >
              
            </Grid>

            {/* {wallet.connected && (
              <p>
                Address: {shortenAddress(wallet.publicKey?.toBase58() || '')}
              </p>
            )}
             

             */}

            {wallet.connected && walletSettings.showBalance && (
              <p className='text-end'>Balance: {formatSol((yourSOLBalance || 0 )).toLocaleString()} SOL</p>
            )}

           
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
