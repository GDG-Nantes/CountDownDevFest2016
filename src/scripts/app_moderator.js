'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';

(function () {

    let gameInit = false, // true if we init the legoGrid
     fireBaseLego = null, // the reference of the fireBaseApp
     legoCanvas = null,  // The legoGrid
     currentKey = null, // The curent firebase draw key
     currentDraw = null, // The curent firebase draw
     readyForNewDraw = true; 


    function initGame(){
        legoCanvas = new LegoGridCanvas('canvasDraw', false);
        getNextDraw();
    }


    function pageLoad() {

        fireBaseLego = new FireBaseLegoApp().app;
        // We init the authentication object 
        let fireBaseAuth = new FireBaseAuth({
            idDivLogin: 'login-msg', 
            idNextDiv : 'game', 
            idLogout : 'signout'
        }); 

        // We start to play only when we are logged
        fireBaseAuth.onAuthStateChanged((user)=> {
            if (user){
                if (!gameInit){
                    gameInit = true;
                    initGame();
                }
            }
        });

        // When a draw is add on the firebase object, we look at it
        fireBaseLego.database().ref('draw').on('child_added', function(data) {
            if (readyForNewDraw){
                getNextDraw();
            }
        });

        // When a draw is removed (if an other moderator validate for example) on the firebase object, we look at it
        fireBaseLego.database().ref('draw').on('child_removed', function(data) {
            // We force a new draw because we always show the first draw
            getNextDraw();
        });

        // We refused the current draw
        document.getElementById('btnSubmissionRefused').addEventListener('click', ()=>{
            /*
                When we refuse an object, we take a snapshot of it to avoid the reconstruction of the canvas.

                We then allow the author to see its draw.
            */
             let dataUrl = legoCanvas.snapshot();
             currentDraw.dataUrl = dataUrl;
             delete currentDraw.instructions;
             // we move the draw to the reject state
             fireBaseLego.database().ref(`draw/${currentKey}`).remove();
             fireBaseLego.database().ref(`/drawSaved/${currentDraw.userId}`).push(currentDraw);
             legoCanvas.resetBoard();
             getNextDraw();
        });

        document.getElementById('btnSubmissionAccepted').addEventListener('click', ()=>{
            /*
                When we accept a draw we move it to an other branch of the firebase tree.

                The count down page could be triggered to this change
             */
            fireBaseLego.database().ref(`draw/${currentKey}`).remove();
            fireBaseLego.database().ref("/drawValidated").push(currentDraw);
            legoCanvas.resetBoard();
            getNextDraw();
        });
        
    }

    /**
     * Calculate the next draw to show
     */
    function getNextDraw(){
        // Each time, we take a snapshot of draw childs and show it to the moderator
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

    /* SERVICE_WORKER_REPLACE
    if ('serviceWorker' in navigator) {        
        navigator.serviceWorker.register('./service-worker-moderator.js', {scope : location.pathname}).then(function(reg) {
            console.log('Service Worker Register for scope : %s',reg.scope);
        });
    }
    SERVICE_WORKER_REPLACE */
})();