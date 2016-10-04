'use strict'

/**
 * Class for generic management of Authentication with firebase.
 * 
 * It takes care of html to hide or show
 */
export class FireBaseAuth{
    constructor(config){
      
        let uiConfig = {
            'callbacks': {
                // Called when the user has been successfully signed in.
                'signInSuccess': function(user, credential, redirectUrl) {
                    // Do not redirect.
                    return false;
                }
            },
            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',
            'signInOptions': [
                {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ['https://www.googleapis.com/auth/plus.login']
                },
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
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
        this.idDivLogin = config.idDivLogin;
        this.idNextDiv = config.idNextDiv;
        this.idLogout = config.idLogout;

        // Optionals
        this.idImg = config.idImg ? config.idImg : null;
        this.idDisplayName = config.idDisplayName ? config.idDisplayName : null;


        firebase.auth().onAuthStateChanged(this._checkCallBackContext.bind(this), 
                                        this._checkCallBackErrorContext.bind(this)
                                        );

        this.cbAuthChanged = null;

        document.getElementById(this.idLogout).addEventListener('click', ()=>  firebase.auth().signOut());
    }

    /**
     * In case of error
     */
    _checkCallBackErrorContext(error){
        console.error(error);
    }

    /**
     * Callback method with the state of connection
     * 
     * According to 'user', it will show or hide some html areas
     */
    _checkCallBackContext(user){
        this.user = user;
        if (user){
            document.getElementById(this.idDivLogin).setAttribute("hidden","");
            document.getElementById(this.idNextDiv).removeAttribute('hidden');
            document.getElementById(this.idLogout).removeAttribute("hidden");            
            if (this.idImg){
                document.getElementById(this.idImg).src = user.photoURL;
                document.getElementById(this.idImg).removeAttribute('hidden');                
            }
            if (this.idDisplayName){
                document.getElementById(this.idDisplayName).innerHTML = user.displayName;;                
            }
        }else{
            document.getElementById(this.idDivLogin).removeAttribute("hidden","");
            document.getElementById(this.idNextDiv).setAttribute("hidden","");
            document.getElementById(this.idLogout).setAttribute("hidden","");
            document.getElementById(this.idImg).src = "";
            document.getElementById(this.idImg).setAttribute('hidden', "");
            document.getElementById(this.idDisplayName).innerHTML = "Non Conntecté";            

        }
        if(this.cbAuthChanged){
            this.cbAuthChanged(user);
        }
      
    }

    /**
     * Registration of callback for futur interaction.
     * The callback method will be called with user as parameter
     */
    onAuthStateChanged(cb){
        this.cbAuthChanged = cb;
    }

    /**
     * Show the name of the current logged user
     */
    displayName(){
        return this.user ? this.user.displayName : null;
    }

    /**
     * Show the id of the current logged user
     */
    userId(){
        return this.user ? this.user.uid : null;
    }
}