import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

function date(date: string){
  let e = new Date(date)
  let f = new anchor.BN(new Date(date).getTime() / 1000)
  return f
}

export interface WhitelistSettings {

    enabled: boolean,
    title: string,
    desc: string | undefined,
    countdown: boolean,
    startDate: anchor.BN,
    endDate: anchor.BN,
    enableCustomHTML: boolean,

}

export interface MintPanic {

  enabled: boolean,
  title: string,
  desc: string,

}

export interface PublicSaleSettings {

  title: string,
  desc: string | undefined,
  countdown: boolean,
  startDate: anchor.BN,
  endDate: anchor.BN | undefined,
  enableCustomHTML: boolean,

}

export interface WelcomeSettings {

  title: string,
  desc: string | undefined,
  countdownEnable: boolean,
  countdownTo: anchor.BN | undefined,
  showPrice: boolean,
  enableCustomHTML: boolean,

}
