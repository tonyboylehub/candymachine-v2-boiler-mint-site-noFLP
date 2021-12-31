import * as anchor from '@project-serum/anchor';

function date(date: string){
  let e = new Date(date)
  let f = new anchor.BN(new Date(date).getTime() / 1000)
  return f
}

export interface WhitelistSettings {

    enabled: boolean,
    title: string,
    desc: string,
    countdown: boolean,
    startDate: anchor.BN,
    endDate: anchor.BN,
    itemsAvailable: boolean,
    itemsRemaining: boolean,
    itemsRedeemed: boolean,
    title2: string,
    desc2: string,

}

export interface PublicSaleSettings {

  title: string,
  desc: string,
  countdown: boolean,
  endDate: anchor.BN,
  itemsAvailable: boolean,
  itemsRemaining: boolean,
  itemsRedeemed: boolean,
  title2: string,
  desc2: string,

}

export interface WelcomeSettings {

  title: string,
  desc: string,
  countdownEnable: boolean,
  countdownTo: anchor.BN | undefined,
  title2: string,
  desc2: string,

}