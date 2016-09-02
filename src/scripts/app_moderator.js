'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';

(function () {

    let gameInit = false,
     fireBaseLego = null,
     legoCanvas = null;

    function initGame(){

        fireBaseLego = new FireBaseLegoApp().app;

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
        initGame();        
        
    }


    window.addEventListener('load', pageLoad);
})();