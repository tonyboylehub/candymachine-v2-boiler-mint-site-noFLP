import * as anchor from '@project-serum/anchor';
import { WhitelistSettings, PublicSaleSettings, WelcomeSettings } from './userSettingsInterfaces'

function date(date: string){
  let f = new anchor.BN(new Date(date).getTime() / 1000)
  return f
}

// 
// Below are settings that will trigger the UI of the mint box currently. This is a basic
// implementation to start with but incorporates whitelist minting sales by turning on
// the mint function between to dates. This will allow users to mint while the candy machine
// is still in it's off state allowing minting via SLP tokens.
//
// You can play with the settings below and also the CMv2 start time setting to trigger different
// the different UI modes.
//
//  This is the current UI set up below and the new phases.
//  
//    Welcome (disconnected wallet) -> Welcome (connected Wallet)
//    Whitelist Countdown (if enabled) -> Whitelist Minting (if enabled)
//    Public Minting
// 
//    any settings you are not using need to be set as 'undefined' without quotetation marks
//    
//         title: undefined
//    
//    for dates use the following format
//    
//        date('1 Jan 2020 00:00:00 <timezone>')
//
//
//


///                             ///
///      Welcome Settings       ///
///                             ///

export const welcomeSettings: WelcomeSettings = {

  
  //Wallet Disconected Title and Description
    title: 'Welcome!',
    desc: 'Connect your wallet and load in! Whitelist mint starts soon!',

    countdownEnable: true,
    countdownTo: date('2 Jan 2022 00:00:00 GMT'),
  
  //Wallet Connected Title and Description
    title2: 'Welcome (Connected) ',
    desc2:'Congratulations! You connected your wallet',


}



///                             ///
///   Whitelist Sale Settings   ///
///                             ///

// The white list does NOTHING to the candy machine itself. It just enables the mint button
// on the site so people can purchase as long as you have the SLP token's set up for you
// whitelist. If your candy machine is not set up for SLP token whitelist purchasing then
// all transations will fail, all transactions will fail for people who also do not hold the
// SLP token. This also does not stop people minting directly from the program.

export const whitelistSettings: WhitelistSettings = {

    enabled: false,
    startDate: date('2nd Dec 2022 00:00:00 GMT'),

    //Make sure your whitelist end date ends before your Candymachine comes online otherwise there will
    //be a flash of the whitelist UI each time someone loads up the site while the wallet connects.
    countdown: true,
    endDate: date('3 Jan 2022 00:00:00 GMT'),

    //Wallet Connected Title and Description
      title: 'White List (connected)',
      desc: 'White list area with wallet connected',

    
    
    //Wallet Disconected Title and Description
      title2: 'White List (disconected)',
      desc2:'White list area with disconected wallet',

    //Enable stats
      itemsAvailable: true,
      itemsRemaining: true,
      itemsRedeemed: true,

}

///                             ///
///     Public Sale Settings    ///
///                             ///


export const publicSaleSettings: PublicSaleSettings = {

  
  //Wallet Connected Title and Description
  title: 'Public Sale',
  desc: 'This is the public sale Wallet Connected',
  
  
  //Wallet Disconnected Title and Description
  title2: ' Public Sale (disconnected)',
  desc2:'This is a public sale with wallet disconnected',

  //Countdown Settings
  countdown: true,
  endDate: date('1 Dec 2021 00:00:00 GMT'),

  //Enable stats
  itemsAvailable: true,
  itemsRemaining: true,
  itemsRedeemed: true,

}




