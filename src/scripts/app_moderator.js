'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';

(function () {

    let gameInit = false,
     fireBaseLego = null,
     legoCanvas = null, 
     currentKey = null,
     currentDraw = null,
     readyForNewDraw = true;

    function initGame(){

        

        legoCanvas = new LegoGridCanvas('canvasDraw', false);

        getNextDraw();
      
    }

    function pageLoad() {

        fireBaseLego = new FireBaseLegoApp().app;
        let fireBaseAuth = new FireBaseAuth({
            idDivLogin: 'login-msg', 
            idNextDiv : 'game', 
            idLogout : 'signout'
        }); 

        fireBaseAuth.onAuthStateChanged((user)=> {
            if (user){
                if (!gameInit){
                    gameInit = true;
                    initGame();
                }
            }
        });

        fireBaseLego.database().ref('draw').on('child_added', function(data) {
            if (readyForNewDraw){
                getNextDraw();
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
        readyForNewDraw = false;
         fireBaseLego.database().ref('draw').once('value', function(snapshot){
            if (snapshot && snapshot.val()){
                currentDraw = snapshot;
                let snapshotFb = snapshot.val();
                let keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
                document.getElementById('proposition-text').innerHTML = `Proposition de ${currentDraw.user}`;
            }else{
                readyForNewDraw = true;
                document.getElementById('proposition-text').innerHTML = "En attente de proposition";
            }
            
        }, function(err) {
            console.error(err);
        // error callback triggered with PERMISSION_DENIED
        });
    }


    window.addEventListener('load', pageLoad);
})();