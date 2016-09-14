'use strict'

export class FireBaseAuth{
    constructor(firebase){
        let uiConfig = {
            'callbacks': {
                // Called when the user has been successfully signed in.
                'signInSuccess': function(user, credential, redirectUrl) {
                    console.info(user);
                //handleSignedInUser(user);
                    // Do not redirect.
                    return false;
                }
            },
            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',
            'signInOptions': [
                // TODO(developer): Remove the providers you don't need for your app.
                {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ['https://www.googleapis.com/auth/plus.login']
                }/*,
                {
                provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                scopes :[
                    'public_profile',
                    'email',
                    'user_likes',
                    'user_friends'
                ]
                }*/,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            'tosUrl': 'https://gdgnantes.com'
        };
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        this.ui.start('#firebaseui-auth-container', uiConfig);
        this.user = null;



        firebase.auth().onAuthStateChanged(this._checkCallBackContext.bind(this), 
                                        this._checkCallBackErrorContext.bind(this)
                                        );

        this.cbAuthChanged = null;
    }

    _checkCallBackErrorContext(error){
        console.error(error);
    }

    _checkCallBackContext(user){
        this.user = user;
        if(this.cbAuthChanged){
            this.cbAuthChanged(user);
        }
        /*if (user) {
            user.getToken().then(function(accessToken) {
                console.info(accessToken);
            });
        } else {
            // User is signed out.
            console.info('signed out');            
        }*/
    }

    onAuthStateChanged(cb){
        this.cbAuthChanged = cb;
    }

    signedOut(){
        firebase.auth().signOut();
    }

    displayName(){
        return this.user ? this.user.displayName : null;
    }

    userId(){
        return this.user ? this.user.uid : null;
    }
}