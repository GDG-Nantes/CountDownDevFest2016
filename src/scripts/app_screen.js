'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';
import {AudioPlayer} from './audio/player.js';

(function () {

    let gameInit = false,
     fireBaseLego = null,
     legoCanvas = null, 
     currentKey = null,
     currentDraw = null,
     minutesElt = null,
     secondsElt = null, 
     lastLeft = false,
     cibleDate = moment('2016-11-09, 09:00:00:000', "YYYY-MM-DD, HH:mm:ss:SSS"),
     readyForNewDraw = true,
     audioPlayer = null;

    function initGame(){

        

        legoCanvas = new LegoGridCanvas('canvasDraw', false);

        getNextDraw();        
      
    }


    function generateSnapshot(user, dataUrl){
        let rectCanvas = document.querySelector('.canvas-container').getBoundingClientRect();
        let flashDiv = document.getElementById('flash-effect')
        flashDiv.style.top = (rectCanvas.top - 250)+"px";
        flashDiv.style.left = (rectCanvas.left -250)+"px";
        flashDiv.classList.add('flash');
        setTimeout(()=>{
            flashDiv.classList.remove('flash');
            let imgParent = document.createElement('div');
            let img = document.createElement('img');
            img.src = dataUrl;
            img.classList.add('img-ori');
            imgParent.classList.add('img-ori-parent');
            imgParent.setAttribute('data-author', user);                
            imgParent.appendChild(img);
            imgParent.classList.add('big');
            // Initial Position
            imgParent.style.top=(rectCanvas.top-45)+"px";
            imgParent.style.left=(rectCanvas.left-45)+"px";                      

            document.body.appendChild(imgParent);
            legoCanvas.resetBoard();
            document.getElementById('proposition-text').innerHTML = "En attente de proposition";

            setTimeout(function() {                    

                let horizontalDist = Math.floor(Math.random() * 300) + 1;
                let heightScreen = document.body.getBoundingClientRect().height;
                let verticalDist = Math.floor(Math.random() * (heightScreen - 100 - 300)) + 1;
                let angleChoice = Math.floor(Math.random() * 3) + 1;    

                imgParent.classList.remove('big');
                imgParent.style.top=`calc(100px + ${verticalDist}px)`;
                imgParent.style.left=`${horizontalDist}px`;
                if (!lastLeft){
                    imgParent.style.left = `calc(100vw - ${horizontalDist}px - 300px)`;                    
                }
                lastLeft = !lastLeft;
                let angle = angleChoice === 1 ? -9 : angleChoice === 2 ? 14 : 0;
                imgParent.style.transform = `rotate(${angle}deg)`; 
                getNextDraw();
            }, 100);
        },500);
    }


    function pageLoad() {

        audioPlayer = new AudioPlayer();

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

        fireBaseLego.database().ref('drawValidated').on('child_added', function(data) {
            if (readyForNewDraw){
                getNextDraw();
            }
        });

        minutesElt = document.getElementById('minutes');
        secondsElt = document.getElementById('seconds');

        cibleDate = moment();
        cibleDate.add(30, 'minutes');
        window.requestAnimationFrame(checkTime);
        
    }

    function checkTime(){

        if (moment().isAfter(cibleDate)){
            // TODO 
        }else{
            let diff = cibleDate.diff(moment());
            minutesElt.innerHTML = new Intl.NumberFormat("fr", {minimumIntegerDigits : 2, useGrouping:false})
                            .format(Math.floor(diff / (60 * 1000)));
            secondsElt.innerHTML = new Intl.NumberFormat("fr", {minimumIntegerDigits : 2, useGrouping:false})
                            .format(Math.floor(diff % (60 * 1000) / 1000));

            window.requestAnimationFrame(checkTime);
        }

    }

    function getNextDraw(){
        readyForNewDraw = false;
         fireBaseLego.database().ref('drawValidated').once('value', function(snapshot){
            if (snapshot && snapshot.val()){
                currentDraw = snapshot;
                let snapshotFb = snapshot.val();
                console.info(snapshotFb);
                let keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                let dataUrl = legoCanvas.snapshot();
                currentDraw.dataUrl = dataUrl;
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
                fireBaseLego.database().ref(`drawValidated/${currentKey}`).remove();
                fireBaseLego.database().ref("/drawValidatedShow").push(currentDraw);
                document.getElementById('proposition-text').innerHTML = `Proposition de ${currentDraw.user}`;
                setTimeout(()=>generateSnapshot(currentDraw.user, dataUrl),2000);
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