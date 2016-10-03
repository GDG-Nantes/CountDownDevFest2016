'use strict'
import {FireBaseLegoApp} from './firebase/firebase.js';

(function () {



    function pageLoad() {

        let fireBaseLego = new FireBaseLegoApp().app;

        fireBaseLego.database().ref('drawShow').once('value', function (snapshot) {
            if (snapshot && snapshot.val()) {
                let snapshotFb = snapshot.val();
                let keys = Object.keys(snapshotFb);
                let domParent = document.createElement('section');
                domParent.classList.add('parent-snapshots');
                keys.forEach((key) => addElement(snapshotFb[key], domParent));
                
                document.getElementById('game').appendChild(domParent);
            }

        });

    }

    function addElement(draw, domParent) {

        let imgParent = document.createElement('div');
        let img = document.createElement('img');
        img.src = draw.dataUrl;
        img.classList.add('img-ori');
        imgParent.classList.add('img-ori-parent');
        imgParent.setAttribute('data-author', draw.user);
        imgParent.appendChild(img);
        imgParent.classList.add('big');
        domParent.appendChild(imgParent);
    }

    window.addEventListener('load', pageLoad);
})();