'use strict'
import {PLAYLIST} from './playlist.js';

export class AudioPlayer{
    constructor(){
        this.indexPlayList = 0;
        this.audioElt = document.createElement('audio');
        this.audioElt.style.display = 'none';
        document.body.appendChild(this.audioElt);
        this._nextSong();
    }

    _playSound(url){
        this.audioElt.pause();
        this.audioElt.src = url;
        this.audioElt.play();
    }

    _nextSong(){
        try{
            this._playSound(`audio/${PLAYLIST[this.indexPlayList]}`);
            this.indexPlayList = (this.indexPlayList + 1) % PLAYLIST.length;
        }catch(err){
            console.error(err);
        }
    }

    manageSoundVolume(delta){
        if (delta < 10 * 1000){
            this.audioElt.volume = Math.min(Math.max(0,delta / (10 * 1000)),0.5);
        }
    }
}