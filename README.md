# candymachine-v2-boiler-mint-site-noFLP

![The Boiler Plate](https://github.com/tonyboylehub/candymachine-v2-boiler-mint-site-noFLP/blob/228e97fc6935153fefcf4f3033b0686f852a9e44/doc-resources/The-Boiler-Plate.png)

This is a stripped out Metaplex FLP site from the Metaplex repo at https://github.com/metaplex-foundation/metaplex
This was built upon version v1.1.0

Donations can be made at tonyboyle.sol if you are feeling generous!


# Installation

1. Clone the repo from the url below.

	```git clone https://github.com/tonyboylehub/candymachine-v2-boiler-mint-site-noFLP.git```

2. Open a terminal in the root of the cloned repo and run yarn install to install all the required dependencies

	```yarn install```

3. Rename `.env-example` to `.env` and fill it with your own data variables.


4. Run yarn start and all should pop up.

	```yarn start```

---

You will need some basic html and css knowledge to get somewhere with this boilerplate. While I kept React components to a minimum where possible in order to help the new people in the web3 space you'll still need some basic web dev knowledge to make major adjustments. Good places to start are sites like https://www.w3schools.com/ and checking out their HTML and CSS tutorials. You shouldn't need any JS to get this up and running.

The site is mobile ready in the sense that it has a mobile menu and some preset anchor links. You'll need to dive through the code to adjust all these to your liking in both the standard nav and the mobile nav.

## Notice!
There seems to be an error with CandymachineV2 and the captcha that won't allow whitelist tokens to be spent while the Gatekeeper is on in the candymachine config and the start date is in the future (whistlist presale mode). I think this is an issue the candymachine itself and the way it deals with its own captcha process. You'll have to have captcha turned off during whitelist/presale and then turn it back on if you want to use it for public sale.


# Customising

### Site Editing
There are 3 main areas to focus on editing and they are;

 **Site Design** - `src/app.tsx`<br/>
All the HTML is located here and includes navigation, mobile menus. You'll need basic HTML knowledge to look through this and adjust the text and images.

**Site Style** - `src/userCSS.css`<br/>
I've moved all the main colors and styling into CSS variables into this file to make everything accessible in one area for new people.

If you are more comfortable with css then head over to `src/app.css` 

 **User Settings** - `src/userSettings.tsx`<br/>
These are the user settings that can display some custom elements on the MintUI and also handle the date logic for showing each of the 3 phases of the MintUI.

	Welcome-> WhiteList Mint(*if enabled*) -> Public Mint

Please pay attention to the dates for each section as this determines how the MintUI is rendered and also if the mint button is enabled.

# 3 Phase MintUI
There are 3 phases to the minting UI.

``Welcome -> Whitelist(optional) ->Public Mint``

To set this correctly you have to set your dates up correctly in the `userSettings.tsx` as well as various other settings such as custom Title, custom description, and even under each phase I've left a little React component that has a marked HTML area for each phase that will inject into the mintUI box.

### Welcome Phase
This is enabled when both the Whitelist Phase and PublicMint start dates are currently not active.

### Whitelist Phase
This will be enabled when the Whitelist Phase dates are met and active. You can optionally turn this off and set the dates into the past if you do not wish to use whitelist. Make sure your Whitelist phase end date is set to time out before the PublicMint startdate begins.

### Public mint stage
Set the start date as the same date as your CandyMachine this will trigger the UI of PublicMint stage.

# WhiteListing
While the UI has a whitelisting function you still need to set up your candy machine for whitelisting for it to be effect. You'll need to have your SLP tokens set up other wise you won't be able to whitelist mint with your candymachine in the off state.

PLEASE NOTE - My UI has no effect on the actual whitelist itself, it's just enabling a UI and enabling a button allowing people to connect to candy machine. You CandyMachine v2 has to be set up 100% correctly with SLP token whitelist for the whitelist function to work as expect.

For white listing you need create your own SLP token. With whitelisting enabled on the Candy Machine v2 you set your custom SLP token address and update it to the Candy Machine. When ever someone visits your Candy Machine and holds on of your SLP tokens they can mint an item wether your Candy Machine v2 is live or not.

# Countdowns
My countdowns work slightly different, the countdowns count to the **END** of the current phase. Not the start of something else.

So if Whitelist starts on 25th January you would actually set the Welcome phase to end on 25th January and countdown to that date.

Subsequently if turn the countdown on in the WhiteList phase then it would countdown to the Whitelist end date. This is so people can have countdowns to whitelist ending if they are not directly leading into a public phase after.

# Minting Panic
There is a mintingPanic option availbe in user settings. If for what ever reason you are experiance a technical issue during launch or for what ever reason you need it turning the mintingPanic to true will disbale all minting on the UI and provide a message of your choice.

# Update Log

v1.2.1 Update
- Fixed some build warnings that were not playing well with Vercel deployment that caused a deployment error.
- Fixed some logic

v1.2 update

- Added whitelist token counting and mint eligibility. App will check wallet for the whitelist token set in your candy machine config.json white list settings and show the user how many mints they are able to make during whitelist.

- Added Mint panic function to user settings. 
This will disable minting UI on the Front End in one setting and display a custom message. Useful is minting isn't quite going to plan due to network errors or such.

- Stripped out all final remains of Metaplex FLP.

- Removed Antirug.

- Removed Confetti files and dependencies from files. Wasn't connected to anything to start with.

- Added nearly all styling varibles to userCSS.css.
Use this area to color your site and change different options. Good for beginners as things are clearly labeled.
For more advaned users head over to app.css

- Removed the disconnected and connected phases that would show different content in the MintUI based on if your wallet was connected or not. This was confusing and I've now opted for a single display for each stage.

- Added custom user HTML options for the 3 phases of the Minting UI including Welcome, Whitelist Minting, and Public Sale. The custom HTML will appear in the box if enabled based on each stage. Please be careful to keep your html without the comment markers unless you know what you are doing.

- Added a few more user settings.

- Restyled The Mint UI box.
---


