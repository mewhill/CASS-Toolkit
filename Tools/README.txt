If you don't have it installed already, download Node.JS from https://nodejs.org/

Next, install the grunt-cli globally (this enables the command 'grunt' to be ran from CMD):

npm install grunt-cli -g

Then run the below command from within the Tools directory to install grunt and dependencies:

npm install

Then go to the Properties page for the Website project and enter the following into the Post Build Event:

CD $(ProjectDir)..\Tools
grunt

You also need npm matchdep to filter npm dependencies
npm install --save matchdep

If you receive an error when building saying that grunt exited with a code of 90009 (or similar)
ensure that you are running Visual Studio with Adminisrative privelages


====== Front End NPM Libraries ======
npm install grunt-contrib-cssmin --save-dev
-- minifies all specified CSS files into one minified file for production

npm install grunt-closure-tools --save-dev
Minifies specified JS project files

Only affects project files (app/main etc)

npm install grunt-critical --save-dev
Creates "critical" (above the fold) CSS

npm install grunt-text-replace --save-dev
Use this to change the MINIFIED JS paths within "config.min.js" to their new locations
-- app/min/*.js lib/min/*.js

Try not to run this separately or before Clouser Compiler, the text would be changed multiple times and could end up having:
app/min/min/min etc


In Web.config, when the isLive check is set to "true" the path of config.js will point to "config.min.js"
Which will then load in files the new MINIFIED files
