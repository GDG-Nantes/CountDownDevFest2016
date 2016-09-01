'use strict'
import {LEGO_COLORS} from './common/legoColors.js';
import {BASE_LEGO_COLOR} from '../common/const.js';
import {FireBaseLegoApp} from './firebase/firebase.js';
import {LegoGridCanvas} from './canvas/legoCanvas.js';


(function () {

    let gameInit = false;

    function initGame(){

        new FireBaseLegoApp().app.database().ref("/test").push({test:true});

        let legoCanvas = new LegoGridCanvas('canvasDraw', true);

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


        
    }


    window.addEventListener('load', pageLoad);
})();