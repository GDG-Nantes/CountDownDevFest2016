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
     hourElt = null,
     minuteElt = null, 
     cibleDate = moment('2016-11-09, 09:00:00:000', "YYYY-MM-DD, HH:mm:ss:SSS");

    function initGame(){

        

        legoCanvas = new LegoGridCanvas('canvasDraw', false);

        getNextDraw();

        setTimeout(()=>{
            let img = document.createElement('div');
            img.style['background-image'] = `url(${legoCanvas.snapshot()})`;//, linear-gradient(to right, #FFF, #FFF)`;
            img.classList.add('img-ori');
            img.setAttribute('data-author', "test");

            document.body.appendChild(img);
        },2000);
      
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

        cibleDate = moment();
        cibleDate.add(30, 'minutes');
        window.requestAnimationFrame(checkTime);
        
    }

    function checkTime(){

        if (moment().isAfter(cibleDate)){
            // TODO 
        }else{
            window.requestAnimationFrame(checkTime);
        }

    }

    function getNextDraw(){
         fireBaseLego.database().ref('drawValidated').on('value', function(snapshot){
            if (snapshot && snapshot.val()){
                currentDraw = snapshot;
                let snapshotFb = snapshot.val();
                let keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
                document.getElementById('proposition-text').innerHTML = `Proposition de ${currentDraw.user}`;
            }else{
                document.getElementById('proposition-text').innerHTML = "En attente de proposition";
            }
            
        }, function(err) {
            console.error(err);
        // error callback triggered with PERMISSION_DENIED
        });
    }


    window.addEventListener('load', pageLoad);
})();