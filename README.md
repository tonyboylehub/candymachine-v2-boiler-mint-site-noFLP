# candymachine-v2-boiler-mint-site-noFLP

This is a stripped out Metaplex FLP site from the Metaplex repo at https://github.com/metaplex-foundation/metaplex
This was built upon version v1.1.0

Donations can be made at tonyboyle.sol

After install ou want to head into 3 main areas after installing all the repositories and adding your candy machine ID to the .env file.

1. Clone
2. Yarn Install
3. Rename .env-example to .env and add in Candy Machine ID
4. Yarn Start

You will need some basic html and css knowledge to get somewhere with this boilerplate. While I kept React components to a minimum where possible in order to help the new people in the web3 space you'll still need some basic web dev knowledge to make major adjustments. Good places to start are sites like https://www.w3schools.com/ and checking out their HTML and CSS tutorials. You shouldn't need any JS to get this up and running.

The site is mobile ready in the sense that it has a mobile menue and some preset anchor links. You'll need to dive through the code to adjust all these to your lking in both the standard nav and the mobile nav.

--------------------
v1.2 update

- Added whitelist token counting and mint eledgibilty. App will check wallet for the whitelist token set in your candy machine config.json white list settings and show the user how many mints they are able to make during whitelist.

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

-------------------

src/app.tsx

This is where all the HTML for the site is laid out. I wrote it mainly in HTML purely to make it easier and logical for beginners in the space.

--------------------

src/userSettings.tsx

Have a read through here.
This is where you can control the UI of the minting machine.

--------------------

src/userCSS.css

To make this more beginner friendly I've moved most of the main CSS values into CSS variables which can be changed in the :root area at the start of the document. These are mainly coloring and small UI tweaks and I don't think you'll be able to break to much here.

--------------------

Points to Mention
* The mint button and UI is controlled by the whitelistMint and PublicMint settings in the userSettings.tsx. Even if your candymachine date is live you will still need to have your dates set within the userSettings to enable the button properly. You need to make sure your userSettings.tsx public mint settings are the same as your CandyMachine V2 config date settings.
