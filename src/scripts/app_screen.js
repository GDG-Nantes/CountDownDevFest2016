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
      
    }


    function generateSnapshot(user){
        let rectCanvas = document.querySelector('.canvas-container').getBoundingClientRect();
        let flashDiv = document.getElementById('flash-effect')
        flashDiv.style.top = (rectCanvas.top - 250)+"px";
        flashDiv.style.left = (rectCanvas.left -250)+"px";
        flashDiv.classList.add('flash');
        setTimeout(()=>{
            flashDiv.classList.remove('flash');
            let imgParent = document.createElement('div');
            let img = document.createElement('img');
            img.src = legoCanvas.snapshot();
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

                let left = Date.now()%2 === 0;
                let horizontalDist = Math.floor(Math.random() * 300) + 1;
                let verticalDist = Math.floor(Math.random() * 90) + 1;
                let angleChoice = Math.floor(Math.random() * 3) + 1;    

                imgParent.classList.remove('big');
                imgParent.style.top=`calc(${verticalDist}vh - 300px + 100px)`;
                if (!left){
                    imgParent.style.left = 'inherit';
                    imgParent.style.right = `${horizontalDist}px`;
                }
                imgParent.style.left=`${horizontalDist}px`;
                let angle = angleChoice === 1 ? -9 : angleChoice === 2 ? 14 : 0;
                imgParent.style.transform = `rotate(${angle}deg)`; 
                //getNextDraw();
            }, 100);
        },500);
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
                setTimeout(()=>generateSnapshot(currentDraw.user),2000);
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