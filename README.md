# candymachine-v2-boiler-mint-site-noFLP

This is a stripped out Metaplex FLP site from the Metaplex repo at https://github.com/metaplex-foundation/metaplex
This was built upon version v1.1.0

I'll update the readme later with a full formated doc but for now this will have to do!

But essentially you want to head into 3 main areas after installing all the repositories and adding your candy machine ID to the .env file.

1. Clone
2. Yarn Install
3. Rename .env-example to .env and add in Candy Machine ID
4. Yarn Start

--------------------
v1.2 update

- Trimmed out all final remains of Metaplex FLP.

- Added Mint panic function to user settings. 
This will disable minting UI on the Front End in one setting and display a custom message.

- Removed Confetti which wasn't connected to anything. Should fix the Yarn install error.

- Added nearly all styling varibles to userCSS.css.
User this area to color your site and change different options. Good for beginners are things are clearly labeled.
For more advaned users head over to app.css

- Got rid of the disconnected and connected phases that would show different content based on if your wallet was connected or not. This was confusing and I swaped out to a single UI for each phase.

- Added custom user HTML options for the 3 phases of the Minting UI including Welcome, Whitelist Minting, and Public Sale. The custom HTML will appear in the box if enabled based on each stage.

- Added a few more user settings.

- Restyled The Mint UI box.

-------------------

src/app.tsx

This is where all the HTML for the site is laid out. I wrote it mainly in HTML purely to make it easier and logical for beginners in the space.

--------------------

src/usersettings.tsx

This is where you can control the UI of the minting machine.

--------------------

src/index.css

To make this more beginner friendly I've moved most of the main CSS values into CSS variables which can be changed in the :root area at the start of the document. These are mainly coloring and small UI tweaks and I don't think you'll be able to break to much here.

--------------------

Points to Mention
* The mint button and UI is controlled by the whitelistMint and PublicMint settings in the userSettings.tsx. Even if your candymachine date is live you will still need to have your dates set within the userSettings to enable the button properly.
