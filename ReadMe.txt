Step 1 : npm init -y
Step 2 : 
    --> npm i express
    --> npm i nodemon --save-dev
    --> npm i express-validator
    --> npm i mongoose 

Step 3 : Create file called app.js
Step 4 : 
    --> Add "type" : "module" to package.json 
    --> Remove "test" from "scripts" and add dev & prod settings like below
    "dev": "nodemon app.js",
    "prod" : "pm2 start app.js --name yourdomain.com"

Step 5 :
    Setup all the routers as per the system

Step 6 :
    Add body-parser middleware to app

Step 7 :
    Database configurations



    Atlas Cluster/Server -> cscodein.emwkkte.mongodb.net    Default Port : 27017

    Note : Create Database Username - Password 

    --> cscodein.emwkkte.mongodb.net --> databases 

    --> cscodein.emwkkte.mongodb.net --> databases --> collections

    --> cscodein.emwkkte.mongodb.net --> databases --> collections --> documents (object) 

    CRUD - Create Read Update Delete

For example : Lets create a database : tasky-app 
