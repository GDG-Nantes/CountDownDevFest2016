'use strict'
import {LEGO_COLORS} from './common/legoColors.js';
import {BASE_LEGO_COLOR} from './common/const.js';
import {FireBaseLegoApp} from './firebase/firebase.js';
import {FireBaseAuth} from './firebase/firebaseAuth.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';


(function () {

    let gameInit = false,
     fireBaseLego = null,
     fireBaseAuth = null,
     legoCanvas = null;

    function initGame(){

        legoCanvas = new LegoGridCanvas('canvasDraw', true);

        $("#color-picker2").spectrum({
            showPaletteOnly: true,
            showPalette:true,
            color: BASE_LEGO_COLOR,
            palette: LEGO_COLORS,
            change: function (color) {
                legoCanvas.changeColor(color.toHexString());
            }
        });
    }

    function pageLoad() {

        fireBaseLego = new FireBaseLegoApp().app;
        fireBaseAuth = new FireBaseAuth({
            idDivLogin: 'login-msg', 
            idNextDiv : 'hello-msg', 
            idLogout : 'signout',
            idImg : "img-user",
            idDisplayName : "name-user"
        }); 

        document.getElementById('startBtn').addEventListener('click', ()=>{
            document.getElementById('hello-msg').setAttribute("hidden","");
            document.getElementById('game').removeAttribute('hidden');
            document.getElementById('color-picker2').removeAttribute('hidden');
            document.getElementById('help').removeAttribute('hidden');

            if (!gameInit){
                gameInit = true;
                initGame();
            }
        });

        document.getElementById('help').addEventListener('click', ()=>{
            document.getElementById('hello-msg').removeAttribute("hidden");
            document.getElementById('game').setAttribute('hidden',"");
            document.getElementById('color-picker2').setAttribute('hidden',"");
            document.getElementById('help').setAttribute('hidden',"");

        });

        document.getElementById('btnSubmission').addEventListener('click',()=>{
            // TODO valider l'envoie
            fireBaseLego.database().ref("/draw").push(legoCanvas.export(fireBaseAuth.displayName(), fireBaseAuth.userId()));
        });


        
    }


    window.addEventListener('load', pageLoad);
})();