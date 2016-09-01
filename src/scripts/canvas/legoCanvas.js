'use strict'
import {Peg} from '../lego_shape/peg.js';
import {NB_CELLS, HEADER_HEIGHT, BASE_LEGO_COLOR} from '../common/const.js';
import {legoBaseColor} from '../common/legoColors.js';

export class LegoGridCanvas{
    constructor(id, showRow){
        this.canvasElt = document.getElementById(id); 
        this.canvasRect = this.canvasElt.getBoundingClientRect();
        this.showRow = showRow;
        this.canvasElt.width = this.canvasRect.width;
        this.canvasElt.height = this.canvasRect.width + (showRow ? HEADER_HEIGHT : 0);

        this.cellSize =  Math.round(this.canvasRect.width / NB_CELLS);

        this.canvas = new fabric.Canvas(id, { selection: false });
        this.rowSelect = {
            square : null,
            rect : null
        };
        this.brickModel = {}, 
        this.createNewBrick = false;
        this.currentBrick = null;
        this.lastColor = BASE_LEGO_COLOR,

        this._drawCanvas();

        this.canvas.on('object:selected', (options) => this.currentBrick = options.target);
        this.canvas.on('selection:cleared', (options) => this.currentBrick = null);

        this.canvas.on('object:moving', (options) => {

            let peg = options.target.parentPeg;


            if (options.target.top < HEADER_HEIGHT 
            || options.target.left < 0
            || options.target.top + this.cellSize > this.canvasElt.height
            || options.target.left + this.cellSize > this.canvasElt.width) {
                peg.toRemove = true;
            }else{
                peg.toRemove = false;
                 if (!peg.replace){
                    if (peg.size === 2){                        
                        this.canvas.add(this._createRect().canvasElt);                        
                    }else{
                        this.canvas.add(this._createSquare().canvasElt);
                    }
                    peg.replace = true;
                }
            }
            peg.move(
                Math.round(options.target.left / this.cellSize) * this.cellSize, //left
                Math.round((options.target.top - HEADER_HEIGHT) / this.cellSize) * this.cellSize + HEADER_HEIGHT // top
            );            

        });

        this.canvas.on('mouse:up', ()=>{
            if (this.currentBrick 
            && this.currentBrick.parentPeg.toRemove
            && this.currentBrick.parentPeg.replace){
                delete this.brickModel[this.currentBrick.parentPeg.id];
                this.canvas.remove(this.currentBrick);
                this.currentBrick = null;
            }
        });

        this.canvas.on('object:rotating', (options) =>{
            let peg = options.target.parentPeg;

           if ((options.target.angle > 0 && options.target.angle < 45)
            ||(options.target.angle < 360 && options.target.angle >= 315)){
                peg.rotate(0);
           }else if (options.target.angle >= 45 && options.target.angle < 135){
               peg.rotate(90);
           }else if (options.target.angle >= 135 && options.target.angle < 225){
               peg.rotate(180);
           }else if (options.target.angle >= 225 && options.target.angle < 315){
               peg.rotate(270);
           }
        });

    }

    changeColor(color){
        this.lastColor = color;
        if (this.currentBrick){
            this.currentBrick.parentPeg.changeColor(color);
        }
        this.rowSelect.square.changeColor(color);
        this.rowSelect.rect.changeColor(color);
        this.canvas.renderAll();
    }

    export(){
        let resultArray = []
        Object.keys(this.brickModel).forEach((key)=>{
            let pegTmp = this.brickModel[key];
            resultArray.push({
                size : pegTmp.size,
                color : pegTmp.color,
                angle : pegTmp.angle,
                top : pegTmp.top,
                left : pegTmp.left
            });
        });
        return {
            user : '',
            instructions : resultArray
        };
    }


    _drawGrid(size) {

        let max = Math.round(size / this.cellSize);
        let maxSize = max * this.cellSize;
        for (var i = 0; i <= max; i++) {
            // Rows
            this.canvas.add(new fabric.Line([i * this.cellSize, HEADER_HEIGHT, i * this.cellSize, maxSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
            // Cols
            this.canvas.add(new fabric.Line([0, i * this.cellSize + HEADER_HEIGHT, maxSize, i * this.cellSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
        }

        this.canvas.add(
            this._createSquare().canvasElt
            , this._createRect().canvasElt
            );


    }

    _createRect(){
        return this._createBrick(2, (this.canvasRect.width / 2) + 2 * this.cellSize);
    }

    _createSquare(){
        return this._createBrick(1, (this.canvasRect.width / 2) - (1 * this.cellSize));
    }

    _createBrick(size, position){
        let peg = new Peg(size, this.cellSize, this.lastColor, position);
        this.brickModel[peg.id] = peg;
        if (size == 1){
            this.rowSelect.square = peg;
        }else{
            this.rowSelect.rect = peg;
        }
        return peg;
    }

    

    _drawCanvas() {
        this._drawGrid(this.canvasRect.width, Math.round(this.canvasRect.width / NB_CELLS));
    }

}