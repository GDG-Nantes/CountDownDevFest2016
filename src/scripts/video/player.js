'use strict'

/**
 * Class for playing video 
 * 
 */
export class VideoPlayer{
    constructor(parentElt, callBackEnd){
        this.videoElt = document.createElement('video');
        parentElt.appendChild(this.videoElt);
        this.videoName = '';        
        this.callBackEnd = callBackEnd;
    }

    /**
     * Play the video
     */
    playVideo(){
        this.videoElt.pause();
        this.videoElt.src = `./assets/video/${this.videoName}`;
        this.videoElt.play();
        this.videoElt.onended = this.callBackEnd.bind(this);
    }
   
}