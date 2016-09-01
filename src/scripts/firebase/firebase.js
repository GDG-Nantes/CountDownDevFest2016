'use strict'

export class FireBaseLegoApp{
    constructor(){
        this.config = {
            apiKey: "AIzaSyDr9R85tNjfKWddW1-N7XJpAhGqXNGaJ5k",
            authDomain: "legonnary.firebaseapp.com",
            databaseURL: "https://legonnary.firebaseio.com",
            storageBucket: "",
        } 

        this.app = firebase.initializeApp(this.config);
    }


}

