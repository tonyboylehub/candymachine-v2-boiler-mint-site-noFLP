# candymachine-v2-boiler-mint-site-noFLP

This is a stripped out Metaplex FLP site from the Metaplex repo at https://github.com/metaplex-foundation/metaplex
This was built upon version v1.1.0

Donations can be made at tonyboyle.sol if you are feeling generous!


# Installation

Clone the repo from the url below.

 ``` git clone https://github.com/tonyboylehub/candymachine-v2-boiler-mint-site-noFLP.git ```

Open a terminal in the root of the cloned repo and run yarn install to install all the required dependencies

```yarn install ```

Rename .env-example to .env and till it with your own data variables.


Run yarn start and all should pop up.

```yarn start ```

---

You will need some basic html and css knowledge to get somewhere with this boilerplate. While I kept React components to a minimum where possible in order to help the new people in the web3 space you'll still need some basic web dev knowledge to make major adjustments. Good places to start are sites like https://www.w3schools.com/ and checking out their HTML and CSS tutorials. You shouldn't need any JS to get this up and running.

The site is mobile ready in the sense that it has a mobile menu and some preset anchor links. You'll need to dive through the code to adjust all these to your liking in both the standard nav and the mobile nav.




# Customising

### Site Editing
There are 3 main areas to focus on editing and they are;

 **Site Design** - `src/app.tsx`
All the HTML is located here and includes navigation, mobile menus. You'll need basic HTML knowledge to look through this and adjust the text and images.

**Site Style** - `src/userCSS.css`
I've moved all the main colors and styling into CSS variables into this file to make everything accessible in one area for new people.

If you are more comfortable with css then head over to `src/app.css` 

 **User Settings** - `src/userSettings.tsx`
These are the user settings that can display some custom elements on the MintUI and also handle the date logic for showing each of the 3 phases of the MintUI.

	Welcome-> WhiteList Mint(*if enabled*) -> Public Mint

Please pay attention to the dates for each section as this determines how the MintUI is rendered and also if the mint button is enabled.

# WhiteListing
While the UI has a whitelisting function you still need to set up your candy machine for whitelisting.

For white listing you need create your own SLP token. With whitelisting enabled on the Candy Machine v2 you set your custom SLP token address and update it to the Candy Machine. When ever someone visits your Candy Machine and holds on of your SLP tokens they can mint an item wether your Candy Machine v2 is live or not.

To combat this the Mint button is disabled on the site unless the whitelist dates are met within the `src/userSettings.tsx` file.

If the dates are met the UI will switch to the whitelisting phase, and enable the mint button on the site enabling users of the token to redeem their NFT.


# Update Log

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


