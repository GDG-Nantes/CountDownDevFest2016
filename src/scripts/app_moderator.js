'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';

(function () {

    let gameInit = false,
     fireBaseLego = null,
     legoCanvas = null;

    function initGame(){

        

        legoCanvas = new LegoGridCanvas('canvasDraw', false);

        fireBaseLego.database().ref('draw').on('value', function(snapshot){
            if (snapshot && snapshot.val()){
                let snapshotFb = snapshot.val();
                let keys = Object.keys(snapshotFb);
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
            }
            
        });
      
    }

    function pageLoad() {

        fireBaseLego = new FireBaseLegoApp().app;
        let fireBaseAuth = new FireBaseAuth(firebase); 

        fireBaseAuth.onAuthStateChanged((user)=> {
            if (user){
                document.getElementById('login-msg').setAttribute("hidden","");
                document.getElementById('game').removeAttribute('hidden');
                document.getElementById('signout').removeAttribute("hidden");
                if (!gameInit){
                    gameInit = true;
                    initGame();
                }
            }else{
                document.getElementById('login-msg').removeAttribute("hidden","");
                document.getElementById('game').setAttribute("hidden","");
                document.getElementById('signout').setAttribute("hidden","");

            }
            console.log(user)
        });

        document.getElementById('signout').addEventListener('click', ()=> fireBaseAuth.signedOut());

        /*document.getElementById('logGoogle').addEventListener('click', ()=>{
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                console.log(user, token);
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

                console.error(error);
                // ...
            });
            document.getElementById('hello-msg').setAttribute("hidden","");
            document.getElementById('game').removeAttribute('hidden');
            document.getElementById('color-picker2').removeAttribute('hidden');
            document.getElementById('help').removeAttribute('hidden');
            if (!gameInit){
                gameInit = true;
                initGame();
            }
        });*/

        
        
    }


    window.addEventListener('load', pageLoad);
})();