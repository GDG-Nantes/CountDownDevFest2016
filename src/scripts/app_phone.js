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
        legoCanvas = null, 
        keys = null,
        snapshotFb = null,
        index = 0;

    function initGame() {

        legoCanvas = new LegoGridCanvas('canvasDraw', true);

        $("#color-picker2").spectrum({
            showPaletteOnly: true,
            showPalette: true,
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
            idNextDiv: 'hello-msg',
            idLogout: 'signout',
            idImg: "img-user",
            idDisplayName: "name-user"
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            document.getElementById('hello-msg').setAttribute("hidden", "");
            document.getElementById('game').removeAttribute('hidden');
            document.getElementById('color-picker2').removeAttribute('hidden');
            document.getElementById('help').removeAttribute('hidden');

            document.getElementById('loading').removeAttribute('hidden');
            // Timeout needed to start the rendering of loading animation (else will not be show)
            setTimeout(function () {

                new Promise(function (resolve, reject) {
                    try {
                        if (!gameInit) {
                            gameInit = true;
                            initGame();
                        }
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
                    .then(() => document.getElementById('loading').setAttribute('hidden', ''))
                    .catch((e) => console.error(e));
            }, 50);

        });

        document.getElementById('help').addEventListener('click', () => {
            document.getElementById('hello-msg').removeAttribute("hidden");
            document.getElementById('game').setAttribute('hidden', "");
            document.getElementById('color-picker2').setAttribute('hidden', "");
            document.getElementById('help').setAttribute('hidden', "");

        });

        document.getElementById('btnSubmission').addEventListener('click', () => {
            // TODO valider l'envoie
            fireBaseLego.database().ref("/draw").push(legoCanvas.export(fireBaseAuth.displayName(), fireBaseAuth.userId()));
            legoCanvas.resetBoard();
        });


        document.getElementById('menu-game').addEventListener('click', () => {
            document.querySelector('.page-content').removeAttribute('hidden');
            document.getElementById('submitted').setAttribute('hidden', '');
            document.getElementById('menu-game').setAttribute('hidden', '');
            document.getElementById('menu-creations').removeAttribute('hidden');
            document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');

        });

        document.getElementById('menu-creations').addEventListener('click', () => {
            document.querySelector('.page-content').setAttribute('hidden', '');
            document.getElementById('submitted').removeAttribute('hidden');
            document.getElementById('menu-game').removeAttribute('hidden');
            document.getElementById('menu-creations').setAttribute('hidden', '');
            document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');

            fireBaseLego.database().ref(`drawSaved/${fireBaseAuth.userId()}`).once('value', function (snapshot) {
                if (snapshot && snapshot.val()) {
                    console.log(snapshot.val());
                    snapshotFb = snapshot.val();
                    keys = Object.keys(snapshotFb);
                    index = 0;
                    draw();                    
                } else {
                    console.log('no draw !');
                }

            }, function (err) {
                console.error(err);
                // error callback triggered with PERMISSION_DENIED
            });
        });

        document.getElementById('btnRight').addEventListener('click', ()=>index = Math.min(index + 1, keys.length - 1));
        document.getElementById('btnLeft').addEventListener('click', ()=>index = Math.max(index - 0, 0));


    }

    function draw(){
        let draw = snapshotFb[keys[index]];
        let imgSubmission = document.getElementById('imgSubmission');
        imgSubmission.src = draw.dataUrl;
        if (draw.accepted && !imgSubmission.classList.contains('accepted')){
            imgSubmission.classList.add('accepted');
        }else{
            imgSubmission.classList.remove('accepted');
        }
        
    }


    window.addEventListener('load', pageLoad);

    /* SERVICE_WORKER_REPLACE
    if ('serviceWorker' in navigator) {        
        navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
            console.log('Service Worker Register for scope : %s',reg.scope);
        });
    }
    SERVICE_WORKER_REPLACE */

})();
