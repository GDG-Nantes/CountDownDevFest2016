'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';

(function () {

    let gameInit = false,
     fireBaseLego = null,
     legoCanvas = null, 
     currentKey = null,
     currentDraw = null;

    function initGame(){

        

        legoCanvas = new LegoGridCanvas('canvasDraw', false);

        getNextDraw();
      
    }

    function pageLoad() {

        fireBaseLego = new FireBaseLegoApp().app;
        let fireBaseAuth = new FireBaseAuth(firebase, 'login-msg', 'game', 'signout'); 

        fireBaseAuth.onAuthStateChanged((user)=> {
            if (user){
                if (!gameInit){
                    gameInit = true;
                    initGame();
                }
            }
        });

        document.getElementById('btnSubmissionRefused').addEventListener('click', ()=>{
             fireBaseLego.database().ref(`draw/${currentKey}`).remove();
             fireBaseLego.database().ref("/drawReject").push(currentDraw);
             legoCanvas.resetBoard();
             getNextDraw();
        });

        document.getElementById('btnSubmissionAccepted').addEventListener('click', ()=>{
            fireBaseLego.database().ref(`draw/${currentKey}`).remove();
            fireBaseLego.database().ref("/drawValidated").push(currentDraw);
            legoCanvas.resetBoard();
            getNextDraw();
        });
        
    }

    function getNextDraw(){
         fireBaseLego.database().ref('draw').on('value', function(snapshot){
            if (snapshot && snapshot.val()){
                currentDraw = snapshot;
                let snapshotFb = snapshot.val();
                let keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
            }
            
        }, function(err) {
            console.error(err);
        // error callback triggered with PERMISSION_DENIED
        });
    }


    window.addEventListener('load', pageLoad);
})();