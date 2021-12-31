# candymachine-v2-boiler-mint-site-noFLP

This is a stripped out Metaplex FLP site from the Metaplex repo at https://github.com/metaplex-foundation/metaplex
This was built upon version v1.1.0

I'll update the readme later with a full formated doc but for now this will have to do!

But essentially you want to head into 3 main areas after installing all the repositories and adding your candy machine ID to the .env file.

1. Clone
2. Yarn Install
3. Rename .env-example to .evn and add in Candy Machine ID
4. Yarn Start

--------------------

src/app.tsx

This is where all the HTML for the side is laid out. I wrote it mainly in HTML purely to make it easier and logical for beginners in the space.

--------------------

src/usersettings.tsx

This is where you can control the UI of the minting machine. There are currently coloring options but I will add these at a later date.

--------------------

src/index.css

To make this more beginner friendly I've moved most of the main CSS values into CSS variables which can be changed in the :root area at the start of the document. These are mainly coloring and small UI tweaks and I don't think you'll be able to break to much here.

--------------------

Points to Mention
* The mint button and UI is controlled by the whitelistMint and PublicMint settings in the userSettings.tsx. Even if your candymachine date is live you will still need to have your dates set within the userSettings to enable the button properly.
