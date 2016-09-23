# CountDownDevFest2016
Count Down of the DevFest 2016

# FireBase Configuration

You have to register your domain and application.

This app use Social Logins with : 
* Google
* FaceBook
* Twitter 
* Github

So don't forget to configure in your firebase console the public key !

# Secure your data

The file database.rules.json define the rules that protect the Database, You just have to add an "admin" node with the correct email : 'my*email@gmail*com' (you have to replace dots by star)

# To deploy : 

## 1. Firebase tools 

`npm install -g firebase-tools`

## 2. Firebase init : 

`firebase init`

## 3. Generate Solution : 

`gulp build`

## 4. Deploy 

`firebase deploy`